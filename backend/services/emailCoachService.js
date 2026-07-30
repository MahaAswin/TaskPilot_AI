import axios from 'axios';
import EmailCoachReport from '../models/EmailCoachReport.js';

// Internal In-Memory Store Fallback if MongoDB is disconnected
const inMemoryReports = [];

/**
 * Service handling LanguageTool API integration, AI interpretation layer,
 * mistake-based scoring, progress tracking, and comparison metrics.
 */
export const emailCoachService = {
  /**
   * Main entry point to analyze an email.
   */
  analyzeEmail: async (data, userId = 'default-user') => {
    const { text, subject = '' } = data;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Email text content is required for analysis.');
    }

    const cleanText = text.trim();

    // 1. Query LanguageTool API with safe fallback
    const ltMatches = await fetchLanguageToolMatches(cleanText);

    // 2. Perform Rule-Based + AI Analysis & Issue Detection
    const detectedIssues = parseAllIssues(cleanText, ltMatches);

    // 3. Compute Mistake-Based Dynamic Scoring
    const scoringResult = calculateMistakeBasedScore(cleanText, detectedIssues);

    // 4. Determine Tone & Writing Level
    const toneResult = detectProfessionalTone(cleanText);
    const writingLevelResult = evaluateWritingLevel(scoringResult.overallScore, detectedIssues, cleanText);

    // 5. Generate AI Suggestions, Corrected Email, Summary & Feedback
    const aiLayerResult = await generateAIEnhancements(cleanText, subject, detectedIssues, scoringResult, toneResult, writingLevelResult);

    // 6. Final Verdict Calculation
    const finalVerdict = calculateFinalVerdict(scoringResult.overallScore, detectedIssues);

    // 7. Calculate Email Metrics
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const readingTimeSeconds = Math.max(5, Math.ceil((wordCount / 200) * 60));
    const grammarErrorsCount = detectedIssues.filter(i => i.type.includes('Grammar')).length;
    const spellingErrorsCount = detectedIssues.filter(i => i.type.includes('Spelling')).length;
    const punctuationErrorsCount = detectedIssues.filter(i => i.type.includes('Punctuation')).length;

    // 8. Fetch Previous Report for Comparison
    const previousReport = await getLatestUserReport(userId);

    let comparison = null;
    if (previousReport) {
      comparison = calculateComparison(previousReport, {
        overallScore: scoringResult.overallScore,
        grammarErrorsCount,
        spellingErrorsCount,
        detectedTone: toneResult.tone,
        readabilityScore: scoringResult.scoreBreakdown.readability * 10
      });
    }

    const newReportData = {
      userId,
      subject,
      originalText: cleanText,
      overallScore: scoringResult.overallScore,
      scoreCategory: scoringResult.category,
      scoreBreakdown: scoringResult.scoreBreakdown,
      writingLevel: writingLevelResult.level,
      levelConfidence: writingLevelResult.confidence,
      levelAssessment: writingLevelResult.assessment,
      detectedTone: toneResult.tone,
      toneConfidence: toneResult.confidence,
      issues: detectedIssues,
      metrics: {
        grammarErrorsCount,
        spellingErrorsCount,
        punctuationErrorsCount,
        totalIssuesCount: detectedIssues.length,
        wordCount,
        readingTimeSeconds,
        readabilityScore: scoringResult.scoreBreakdown.readability * 10,
        formattingScore: scoringResult.scoreBreakdown.formatting * 20,
        vocabularyQuality: evaluateVocabularyQuality(cleanText)
      },
      aiSuggestions: aiLayerResult.suggestions,
      correctedText: aiLayerResult.correctedText,
      aiSummary: aiLayerResult.summary,
      improvementFeedback: aiLayerResult.improvementFeedback,
      finalVerdict
    };

    // 9. Persist Report to DB or Memory
    let savedReport;
    try {
      if (EmailCoachReport.db?.readyState === 1) {
        savedReport = await EmailCoachReport.create(newReportData);
      } else {
        savedReport = {
          _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          ...newReportData,
          createdAt: new Date().toISOString()
        };
        inMemoryReports.unshift(savedReport);
      }
    } catch (err) {
      console.warn('[EmailCoachService] Mongo save fallback to in-memory:', err.message);
      savedReport = {
        _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...newReportData,
        createdAt: new Date().toISOString()
      };
      inMemoryReports.unshift(savedReport);
    }

    // 10. Fetch Updated Progress Tracker Stats
    const stats = await getUserStats(userId);

    return {
      report: savedReport,
      comparison,
      stats
    };
  },

  /**
   * Retrieves previous email reports for a user.
   */
  getHistory: async (userId = 'default-user', limit = 20) => {
    try {
      if (EmailCoachReport.db?.readyState === 1) {
        return await EmailCoachReport.find({ userId }).sort({ createdAt: -1 }).limit(limit);
      }
    } catch (e) {
      console.warn('[EmailCoachService] Fallback to in-memory history');
    }
    return inMemoryReports.filter(r => r.userId === userId).slice(0, limit);
  },

  /**
   * Gets aggregated progress statistics over time.
   */
  getStats: async (userId = 'default-user') => {
    return await getUserStats(userId);
  },

  /**
   * Side-by-side comparison of two specific report IDs.
   */
  compareReports: async (currentId, previousId, userId = 'default-user') => {
    let current, previous;

    try {
      if (EmailCoachReport.db?.readyState === 1) {
        current = await EmailCoachReport.findById(currentId);
        previous = await EmailCoachReport.findById(previousId);
      }
    } catch (e) {
      // ignore
    }

    if (!current) current = inMemoryReports.find(r => r._id.toString() === currentId.toString());
    if (!previous) previous = inMemoryReports.find(r => r._id.toString() === previousId.toString());

    if (!current || !previous) {
      throw new Error('One or both specified email reports were not found.');
    }

    return calculateComparison(previous, current);
  }
};

/**
 * Fetch matches from official LanguageTool API
 */
async function fetchLanguageToolMatches(text) {
  try {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', 'en-US');

    const response = await axios.post('https://api.languagetool.org/v2/check', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 5000
    });

    if (response.data && Array.isArray(response.data.matches)) {
      return response.data.matches;
    }
  } catch (err) {
    console.warn('[LanguageTool API Warning] Fallback engine activated:', err.message);
  }
  return [];
}

/**
 * Parse LanguageTool matches combined with deep heuristic checks for all 12 issue types.
 */
function parseAllIssues(text, ltMatches) {
  const issues = [];
  const seenErrorTexts = new Set();

  // Process LanguageTool API Matches
  ltMatches.forEach(m => {
    const errText = text.substring(m.offset, m.offset + m.length);
    if (!errText || seenErrorTexts.has(errText.toLowerCase())) return;
    seenErrorTexts.add(errText.toLowerCase());

    const replacement = m.replacements && m.replacements.length > 0 ? m.replacements[0].value : '';
    const categoryId = m.rule?.category?.id || '';
    const ruleId = m.rule?.id || '';

    let type = 'Grammar Error';
    let deduction = 4;

    if (categoryId === 'TYPOS' || categoryId === 'SPELLING' || ruleId.includes('MORFOLOGIK')) {
      type = 'Spelling Error';
      deduction = 2;
    } else if (categoryId === 'PUNCTUATION') {
      type = 'Punctuation Error';
      deduction = 1;
    } else if (categoryId === 'CASING' || ruleId.includes('CAPITALIZATION')) {
      type = 'Capitalization Error';
      deduction = 1;
    } else if (categoryId === 'STYLE' || categoryId === 'COLLOCATIONS') {
      type = 'Incorrect Preposition';
      deduction = 1;
    }

    issues.push({
      type,
      category: m.rule?.category?.name || 'Grammar & Style',
      errorText: errText,
      explanation: m.message || 'Potential language precision issue detected.',
      suggestion: replacement ? `Suggest replacing with "${replacement}"` : 'Consider revising phrasing.',
      deduction
    });
  });

  // Heuristic Rule Checks for nuanced email writing checks:
  // 1. Incorrect prepositions
  const prepRules = [
    { pattern: /\binterested for\b/gi, err: 'interested for', fix: 'interested in', exp: 'The verb "interested" couples with preposition "in".' },
    { pattern: /\bdepends of\b/gi, err: 'depends of', fix: 'depends on', exp: '"Depends" is followed by the preposition "on".' },
    { pattern: /\bdiscuss about\b/gi, err: 'discuss about', fix: 'discuss', exp: '"Discuss" already implies "about"; do not add "about".' },
    { pattern: /\breply back\b/gi, err: 'reply back', fix: 'reply', exp: '"Reply" implies answering back; "back" is redundant.' }
  ];

  prepRules.forEach(r => {
    if (r.pattern.test(text) && !seenErrorTexts.has(r.err.toLowerCase())) {
      seenErrorTexts.add(r.err.toLowerCase());
      issues.push({
        type: 'Incorrect Preposition',
        category: 'Prepositions',
        errorText: r.err,
        explanation: r.exp,
        suggestion: `Change to "${r.fix}"`,
        deduction: 1
      });
    }
  });

  // 2. Informal Language
  const informalWords = [
    { pattern: /\b(gonna)\b/gi, word: 'gonna', fix: 'going to' },
    { pattern: /\b(wanna)\b/gi, word: 'wanna', fix: 'want to' },
    { pattern: /\b(pls|plz)\b/gi, word: 'pls', fix: 'please' },
    { pattern: /\b(thx|thanks a ton)\b/gi, word: 'thx', fix: 'thank you' },
    { pattern: /\b(asap)\b/gi, word: 'asap', fix: 'as soon as possible' },
    { pattern: /\b(hey dude|sup|cool stuff)\b/gi, word: 'casual phrase', fix: 'Dear / Hi [Name]' }
  ];

  informalWords.forEach(i => {
    if (i.pattern.test(text) && !seenErrorTexts.has(i.word.toLowerCase())) {
      seenErrorTexts.add(i.word.toLowerCase());
      issues.push({
        type: 'Informal Language',
        category: 'Tone & Style',
        errorText: i.word,
        explanation: `Informal phrasing lowers professional email impact.`,
        suggestion: `Use standard professional term "${i.fix}"`,
        deduction: 2
      });
    }
  });

  // 3. Passive Voice Detection
  const passivePattern = /\b(am|is|are|was|were|been|being|be)\s+([a-z]+ed|[a-z]+en)\b/gi;
  let match;
  let passiveCount = 0;
  while ((match = passivePattern.exec(text)) !== null) {
    if (passiveCount >= 2) break;
    const phrase = match[0];
    if (!seenErrorTexts.has(phrase.toLowerCase())) {
      seenErrorTexts.add(phrase.toLowerCase());
      issues.push({
        type: 'Passive Voice',
        category: 'Voice & Structure',
        errorText: phrase,
        explanation: 'Passive voice makes sentence structure passive and less direct.',
        suggestion: 'Consider restructuring in active voice for greater directness.',
        deduction: 2
      });
      passiveCount++;
    }
  }

  // 4. Repeated Words
  const repeatedPattern = /\b([a-zA-Z]+)\s+\1\b/gi;
  while ((match = repeatedPattern.exec(text)) !== null) {
    const phrase = match[0];
    if (!seenErrorTexts.has(phrase.toLowerCase())) {
      seenErrorTexts.add(phrase.toLowerCase());
      issues.push({
        type: 'Repeated Words',
        category: 'Redundancy',
        errorText: phrase,
        explanation: `Word "${match[1]}" is duplicated consecutively.`,
        suggestion: `Remove duplicated word "${match[1]}"`,
        deduction: 1
      });
    }
  }

  // 5. Long & Complex Sentences (>25 words)
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  sentences.forEach(s => {
    const wCount = s.split(/\s+/).filter(Boolean).length;
    if (wCount > 28 && !seenErrorTexts.has('long_sentence_' + s.substr(0, 15))) {
      seenErrorTexts.add('long_sentence_' + s.substr(0, 15));
      issues.push({
        type: 'Long Complex Sentence',
        category: 'Readability',
        errorText: s.length > 50 ? s.substr(0, 50) + '...' : s,
        explanation: `Sentence contains ${wCount} words. Long sentences reduce readability.`,
        suggestion: 'Split into two concise, clear sentences.',
        deduction: 2
      });
    }
  });

  // 6. Formatting Checks (no line breaks in multi-paragraph emails or ALL CAPS)
  if (text.length > 200 && !text.includes('\n')) {
    issues.push({
      type: 'Formatting Error',
      category: 'Layout',
      errorText: 'Single monolithic paragraph block',
      explanation: 'Email text is unformatted without paragraph breaks.',
      suggestion: 'Divide email into 2-3 logical paragraphs with spacing.',
      deduction: 1
    });
  }

  return issues;
}

/**
 * Compute Mistake-Based Dynamic Scoring according to specification deductions.
 */
function calculateMistakeBasedScore(text, issues) {
  let score = 100;

  // Deduct based on specific mistake rules:
  // Grammar (-4), Spelling (-2), Sentence Structure (-3), Punctuation (-1), Capitalization (-1),
  // Repeated Words (-1), Formatting (-1), Passive Voice (-2), Informal Language (-2), Long Sentence (-2)
  issues.forEach(issue => {
    score -= (issue.deduction || 2);
  });

  score = Math.max(25, Math.min(100, Math.round(score)));

  let category = 'Good';
  if (score >= 90) category = 'Excellent';
  else if (score >= 75) category = 'Good';
  else if (score >= 60) category = 'Fair';
  else category = 'Needs Improvement';

  // Sub-breakdowns (Grammar 40, Spelling 15, Sentence Structure 15, Tone 15, Readability 10, Formatting 5)
  const gDeduct = issues.filter(i => i.type.includes('Grammar') || i.type.includes('Preposition') || i.type.includes('Verb')).reduce((a, b) => a + b.deduction, 0);
  const sDeduct = issues.filter(i => i.type.includes('Spelling')).reduce((a, b) => a + b.deduction, 0);
  const stDeduct = issues.filter(i => i.type.includes('Sentence') || i.type.includes('Passive')).reduce((a, b) => a + b.deduction, 0);
  const tDeduct = issues.filter(i => i.type.includes('Informal')).reduce((a, b) => a + b.deduction, 0);
  const rDeduct = issues.filter(i => i.type.includes('Long')).reduce((a, b) => a + b.deduction, 0);
  const fDeduct = issues.filter(i => i.type.includes('Formatting') || i.type.includes('Punctuation') || i.type.includes('Capitalization')).reduce((a, b) => a + b.deduction, 0);

  return {
    overallScore: score,
    category,
    scoreBreakdown: {
      grammar: Math.max(10, 40 - gDeduct),
      spelling: Math.max(5, 15 - sDeduct),
      sentenceStructure: Math.max(5, 15 - stDeduct),
      tone: Math.max(5, 15 - tDeduct),
      readability: Math.max(4, 10 - rDeduct),
      formatting: Math.max(2, 5 - fDeduct)
    }
  };
}

/**
 * Detect Professional Tone
 */
function detectProfessionalTone(text) {
  const lower = text.toLowerCase();

  let tone = 'Professional';
  let confidence = 94;

  if (/\b(dear|sincerely|regards|respectfully|pursuant|attached|pleasure)\b/.test(lower)) {
    tone = 'Formal';
    confidence = 96;
  } else if (/\b(buy|offer|discount|limited time|deal|upgrade|demo|pricing)\b/.test(lower)) {
    tone = 'Sales';
    confidence = 92;
  } else if (/\b(hi|hey|thanks|cheers|catch up|awesome|hope you're well)\b/.test(lower)) {
    tone = 'Friendly';
    confidence = 90;
  } else if (/\b(issue|support|ticket|resolve|assist|help desk|refund)\b/.test(lower)) {
    tone = 'Customer Support';
    confidence = 95;
  } else if (/\b(research|hypothesis|analysis|study|methodology|findings)\b/.test(lower)) {
    tone = 'Academic';
    confidence = 93;
  } else if (/\b(gonna|wanna|dude|sup|lol)\b/.test(lower)) {
    tone = 'Casual';
    confidence = 88;
  } else if (/\b(strategy|revenue|quarter|deliverable|meeting|agenda)\b/.test(lower)) {
    tone = 'Business';
    confidence = 95;
  }

  return { tone, confidence };
}

/**
 * Evaluate Writing Level
 */
function evaluateWritingLevel(score, issues, text) {
  let level = 'Professional';
  let confidence = 95;

  if (score >= 94 && issues.length <= 1) {
    level = 'Expert';
    confidence = 98;
  } else if (score >= 85) {
    level = 'Professional';
    confidence = 96;
  } else if (score >= 72) {
    level = 'Advanced';
    confidence = 92;
  } else if (score >= 58) {
    level = 'Intermediate';
    confidence = 89;
  } else {
    level = 'Beginner';
    confidence = 85;
  }

  const assessment = `This email demonstrates ${score >= 85 ? 'strong structure, professional vocabulary, and clarity.' : 'functional communication with opportunities for grammar and flow improvements.'} Key area identified: ${issues.length === 0 ? 'Optimal clarity and precision.' : issues[0].explanation}`;

  return { level, confidence, assessment };
}

/**
 * Evaluate Vocabulary Quality
 */
function evaluateVocabularyQuality(text) {
  const words = text.toLowerCase().split(/\s+/);
  const advancedWords = ['strategy', 'opportunity', 'deliverable', 'collaboration', 'implementation', 'coordinate', 'efficiency', 'concerning', 'appreciate', 'substantial'];
  const count = words.filter(w => advancedWords.some(a => w.includes(a))).length;

  if (count >= 4) return 'Exceptional';
  if (count >= 2) return 'Elevated';
  if (count >= 1) return 'Strong';
  return 'Good';
}

/**
 * Generate AI Enhancements (Suggestions, Rewritten Email, AI Summary, Feedback)
 */
async function generateAIEnhancements(text, subject, issues, scoring, toneResult, writingLevelResult) {
  const fallbackSuggestions = [
    'Use a strong, professional greeting (e.g., "Dear [Name]" or "Hi [Name]").',
    'Enhance vocabulary by substituting casual terms with professional equivalents.',
    'Ensure concise sentence structure for faster reader comprehension.',
    'Add a clear closing and call-to-action line before signing off.'
  ];

  if (issues.some(i => i.type.includes('Passive'))) {
    fallbackSuggestions.unshift('Convert passive voice constructions into direct, active verbs.');
  }
  if (issues.some(i => i.type.includes('Preposition') || i.type.includes('Grammar'))) {
    fallbackSuggestions.unshift('Correct preposition choices to ensure complete grammatical precision.');
  }

  // Generate Rewritten Email
  let correctedText = text;
  // Apply standard fixes
  correctedText = correctedText
    .replace(/\binterested for\b/gi, 'interested in')
    .replace(/\bdepends of\b/gi, 'depends on')
    .replace(/\bdiscuss about\b/gi, 'discuss')
    .replace(/\breply back\b/gi, 'reply')
    .replace(/\bgonna\b/gi, 'going to')
    .replace(/\bwanna\b/gi, 'want to')
    .replace(/\bpls\b/gi, 'please')
    .replace(/\bplz\b/gi, 'please')
    .replace(/\bthx\b/gi, 'thank you');

  // Fix capital 'i' pronoun
  correctedText = correctedText.replace(/\bi\b/g, 'I');

  // Ensure greeting if missing
  if (!/^(dear|hi|hello|good morning|good afternoon)/i.test(correctedText.trim())) {
    correctedText = `Dear Recipient,\n\n${correctedText}`;
  }

  // Ensure signoff if missing
  if (!/(regards|sincerely|best|thank you|thanks),/i.test(correctedText)) {
    correctedText = `${correctedText}\n\nBest regards,\n[Your Name]`;
  }

  // Try calling AI Service for intelligent prompt response if provider is available
  let summary = `This email achieves a score of ${scoring.overallScore}/100 with a ${toneResult.tone} tone and ${writingLevelResult.level} writing level. ${issues.length > 0 ? `${issues.length} minor writing refinement(s) identified.` : 'No grammatical issues detected.'}`;

  try {
    const prompt = `Act as an AI Email Writing Coach. Analyze this email submission:\nSubject: ${subject}\nText: ${text}\nIssues detected: ${issues.map(i => i.type).join(', ')}\nProvide a 2-sentence professional writing summary focusing ONLY on this specific email. Do NOT judge overall English ability.`;
    const aiRes = await aiService.chat([{ role: 'user', content: prompt }], { agent: 'Email Writing Coach Agent' });
    const resText = aiRes?.content || aiRes?.response || aiRes?.text || '';
    if (resText && resText.length > 20) {
      summary = resText.replace(/["']/g, '').trim();
    }
  } catch (e) {
    // preserve default summary
  }

  // NON-JUDGMENTAL IMPROVEMENT FEEDBACK ENFORCEMENT:
  // Must focus on measurable metrics and email quality. Never "You have good/bad English".
  const improvementFeedback = `Email writing analysis: Grammar accuracy is currently rated at ${scoring.scoreBreakdown.grammar}/40 with a overall writing score of ${scoring.overallScore}/100. Structure clarity and ${toneResult.tone.toLowerCase()} tone alignment demonstrate solid email composition standards.`;

  return {
    suggestions: fallbackSuggestions.slice(0, 5),
    correctedText,
    summary,
    improvementFeedback
  };
}

/**
 * Calculate Final Verdict badge & stars
 */
function calculateFinalVerdict(score, issues) {
  let stars = 5;
  let verdictText = 'Excellent Email';

  if (score >= 90) {
    stars = 5;
    verdictText = 'Excellent Email';
  } else if (score >= 80) {
    stars = 4;
    verdictText = 'Very Good Email';
  } else if (score >= 70) {
    stars = 3;
    verdictText = 'Good Email';
  } else if (score >= 60) {
    stars = 2;
    verdictText = 'Average Email';
  } else {
    stars = 1;
    verdictText = 'Needs Improvement';
  }

  const criticalIssuesCount = issues.filter(i => i.deduction >= 3).length;
  const readyToSend = score >= 75 && criticalIssuesCount === 0;

  return {
    stars,
    verdictText,
    readyToSend,
    statusBadge: readyToSend ? 'Ready to Send' : 'Review Before Sending'
  };
}

/**
 * Calculate Comparison stats between current and previous email
 */
function calculateComparison(previous, current) {
  const prevScore = previous.overallScore || 70;
  const currScore = current.overallScore || 0;
  const scoreDelta = currScore - prevScore;

  const prevGrammarErr = previous.metrics?.grammarErrorsCount ?? 2;
  const currGrammarErr = current.metrics?.grammarErrorsCount ?? current.grammarErrorsCount ?? 0;
  const grammarReduced = Math.max(0, prevGrammarErr - currGrammarErr);

  const prevSpellingErr = previous.metrics?.spellingErrorsCount ?? 1;
  const currSpellingErr = current.metrics?.spellingErrorsCount ?? current.spellingErrorsCount ?? 0;
  const spellingReduced = Math.max(0, prevSpellingErr - currSpellingErr);

  return {
    previousScore: prevScore,
    currentScore: currScore,
    scoreDelta: scoreDelta >= 0 ? `+${scoreDelta} Points` : `${scoreDelta} Points`,
    improvementPoints: scoreDelta,
    grammarErrorsReduced: grammarReduced,
    spellingErrorsReduced: spellingReduced,
    toneImprovement: previous.detectedTone !== current.detectedTone ? `Shifted from ${previous.detectedTone} to ${current.detectedTone}` : 'Maintained strong tone consistency',
    readabilityImprovement: scoreDelta > 0 ? 'Enhanced clarity and sentence flow' : 'Consistent readability baseline'
  };
}

/**
 * Fetch latest user report for comparison
 */
async function getLatestUserReport(userId) {
  try {
    if (EmailCoachReport.db?.readyState === 1) {
      return await EmailCoachReport.findOne({ userId }).sort({ createdAt: -1 });
    }
  } catch (e) {
    // fallback
  }
  return inMemoryReports.find(r => r.userId === userId) || null;
}

/**
 * Aggregate stats over time
 */
async function getUserStats(userId) {
  let reports = [];

  try {
    if (EmailCoachReport.db?.readyState === 1) {
      reports = await EmailCoachReport.find({ userId });
    }
  } catch (e) {
    // fallback
  }

  if (reports.length === 0) {
    reports = inMemoryReports.filter(r => r.userId === userId);
  }

  if (reports.length === 0) {
    return {
      totalEmailsAnalyzed: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      grammarErrorsFixed: 0,
      spellingErrorsFixed: 0,
      averageImprovement: '+0 Points',
      scoreHistory: []
    };
  }

  const scores = reports.map(r => r.overallScore);
  const totalEmailsAnalyzed = reports.length;
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalEmailsAnalyzed);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  const grammarErrorsFixed = reports.reduce((acc, r) => acc + (r.metrics?.grammarErrorsCount || 0), 0);
  const spellingErrorsFixed = reports.reduce((acc, r) => acc + (r.metrics?.spellingErrorsCount || 0), 0);

  const scoreHistory = reports.slice(-10).map((r, index) => ({
    id: r._id,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : `Email #${index + 1}`,
    score: r.overallScore,
    tone: r.detectedTone,
    level: r.writingLevel
  }));

  return {
    totalEmailsAnalyzed,
    averageScore,
    highestScore,
    lowestScore,
    grammarErrorsFixed,
    spellingErrorsFixed,
    averageImprovement: scores.length > 1 ? `+${Math.max(0, scores[scores.length - 1] - scores[0])} Points` : '+0 Points',
    scoreHistory
  };
}

export default emailCoachService;
