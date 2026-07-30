import EmailBriefingReport from '../models/EmailBriefingReport.js';
import GrammarService from './grammar/GrammarService.js';

const inMemoryBriefings = [];

export const emailBriefingService = {
  /**
   * Main entry point to extract email text & generate structured AI Briefing.
   */
  analyzeBriefing: async ({ text, file, fileName = '' }, userId = 'default-user') => {
    let rawText = text || '';
    let processedFileName = fileName;

    // Handle File Buffer if uploaded
    if (file) {
      processedFileName = file.originalname || fileName || 'Uploaded_Document';
      rawText = extractTextFromBuffer(file.buffer, processedFileName, file.mimetype);
    }

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      throw new Error('Please provide email text or upload a valid .txt, .pdf, .docx, or .eml document.');
    }

    const cleanText = rawText.trim();

    // 1. LanguageTool Grammar & Writing Check (Executes BEFORE AI Coordinator)
    let grammarAnalysis = null;
    try {
      grammarAnalysis = await GrammarService.analyze(cleanText);
    } catch (gErr) {
      console.error('[EmailBriefingService] Grammar analysis error:', gErr.message);
      grammarAnalysis = { available: false, assessmentFeedback: 'Grammar analysis temporarily unavailable.' };
    }

    // 2. Build AI Executive Briefing Prompt
    const systemPrompt = `You are the TaskPilot AI Executive Briefing Assistant.
Analyze the following email content.
CRITICAL MANDATE - NO HALLUCINATIONS:
- Do NOT invent or fabricate sender details, recipient emails, deadlines, links, or calendar times.
- If information is not explicitly mentioned or clearly inferred in the text, return "Not Mentioned" or an empty array [].
- If a date is ambiguous, indicate that it is inferred.

Return ONLY a single valid JSON object strictly matching this schema:
{
  "summary": "Concise summary maximum 100 words.",
  "purpose": "Project Update | Meeting Invitation | Job Offer | Interview Schedule | Invoice | Support Ticket | Promotion | Complaint | Reminder | Approval Request | Leave Request | General Inquiry",
  "sender": {
    "name": "Sender Name or Not Mentioned",
    "email": "Sender Email or Not Mentioned",
    "organization": "Organization Name or Not Mentioned"
  },
  "recipient": {
    "name": "Recipient Name or Not Mentioned",
    "email": "Recipient Email or Not Mentioned"
  },
  "subject": "Email Subject or No Subject",
  "priority": "🔴 High | 🟡 Medium | 🟢 Low",
  "deadlines": ["List of explicit deadlines or Empty Array"],
  "importantDates": ["Chronological list of extracted dates"],
  "tasks": ["Actionable checklist items starting with action verbs"],
  "questions": ["Questions asked in the email"],
  "links": ["URLs, Zoom/Meet/Teams links, Drive links"],
  "attachmentsMentioned": ["Attachment filenames or documents referenced"],
  "calendarEvents": [
    {
      "title": "Meeting / Event Title",
      "date": "YYYY-MM-DD or Inferred Date",
      "time": "Time or Not Mentioned",
      "reminder": "Suggested reminder duration e.g. 15 mins before"
    }
  ],
  "replyRequired": {
    "required": true,
    "reason": "Clear explanation why reply is or is not required"
  },
  "category": "Work | Personal | Banking | Education | Shopping | Recruitment | Travel | Finance | Healthcare | Legal",
  "riskLevel": "Safe | Warning | Suspicious",
  "readingTime": "Estimated reading time e.g. 25 sec",
  "recommendations": ["Actionable next step suggestions"],
  "keyHighlights": ["Up to 10 most important key sentences"]
}

Email Content to Analyze:
${cleanText.slice(0, 8000)}`;

    // 2. Query AI Provider (Gemini / Grok / Ollama / Mock)
    let aiResponseText = '';
    try {
      const aiResult = await aiService.chat([{ role: 'user', content: systemPrompt }], { agent: 'Email Briefing Agent' });
      aiResponseText = aiResult?.content || aiResult?.response || aiResult?.text || '';
    } catch (err) {
      console.warn('[EmailBriefingService] AI Provider error, switching to rule fallback engine:', err.message);
    }

    // 3. Parse JSON with Fallback Guarantee
    const briefingData = parseBriefingJSON(aiResponseText, cleanText);

    // 4. Calculate Risk Flags if password/payment/urgent keywords detected
    if (/password|bank account|wire transfer|urgent payment|credit card/i.test(cleanText)) {
      briefingData.riskLevel = 'Warning';
    }

    // Generate polished corrected rewrite preserving layout & headers
    let correctedText = cleanText
      .replace(/\byour doing\b/gi, "you're doing")
      .replace(/\binterested for\b/gi, "interested in")
      .replace(/\bdepends of\b/gi, "depends on")
      .replace(/\bdiscuss about\b/gi, "discuss")
      .replace(/\breply back\b/gi, "reply")
      .replace(/\bgonna\b/gi, "going to")
      .replace(/\bwanna\b/gi, "want to")
      .replace(/\bpls\b/gi, "please")
      .replace(/\bthx\b/gi, "thank you");

    const reportRecord = {
      userId,
      rawText: cleanText,
      fileName: processedFileName,
      grammarAnalysis,
      correctedText,
      ...briefingData
    };

    // 5. Save to MongoDB or In-Memory
    let savedReport;
    try {
      if (EmailBriefingReport.db?.readyState === 1) {
        savedReport = await EmailBriefingReport.create(reportRecord);
      } else {
        savedReport = {
          _id: `brief_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          ...reportRecord,
          createdAt: new Date().toISOString()
        };
        inMemoryBriefings.unshift(savedReport);
      }
    } catch (e) {
      savedReport = {
        _id: `brief_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...reportRecord,
        createdAt: new Date().toISOString()
      };
      inMemoryBriefings.unshift(savedReport);
    }

    return savedReport;
  },

  /**
   * Retrieves past briefing reports for user.
   */
  getHistory: async (userId = 'default-user', limit = 20) => {
    try {
      if (EmailBriefingReport.db?.readyState === 1) {
        return await EmailBriefingReport.find({ userId }).sort({ createdAt: -1 }).limit(limit);
      }
    } catch (e) {
      // fallback
    }
    return inMemoryBriefings.filter(b => b.userId === userId).slice(0, limit);
  },

  /**
   * Generates AI reply draft based on briefing.
   */
  generateReplyDraft: async (reportId, instruction = '', userId = 'default-user') => {
    let briefing;
    try {
      if (EmailBriefingReport.db?.readyState === 1) {
        briefing = await EmailBriefingReport.findById(reportId);
      }
    } catch (e) {}

    if (!briefing) {
      briefing = inMemoryBriefings.find(b => b._id.toString() === reportId.toString());
    }

    const prompt = `Write a professional executive email reply based on this email summary:
Subject: ${briefing?.subject || 'Reply'}
Sender: ${briefing?.sender?.name || 'Sender'} (${briefing?.sender?.email || ''})
Summary: ${briefing?.summary || ''}
User Instruction: ${instruction || 'Polite professional acknowledgment and action steps'}

Keep it clear, concise, and professional.`;

    try {
      const result = await aiService.chat([{ role: 'user', content: prompt }], { agent: 'Email Briefing Agent' });
      return { replyText: result.content || result.response || result.text };
    } catch (e) {
      return {
        replyText: `Dear ${briefing?.sender?.name !== 'Not Mentioned' ? briefing?.sender?.name : 'Sender'},\n\nThank you for your email regarding "${briefing?.subject || 'the update'}".\n\nI have received your message and will review the details accordingly.\n\nBest regards,\n[Your Name]`
      };
    }
  }
};

/**
 * Text Extractor for Buffer Files (.txt, .eml, .pdf, .docx)
 */
function extractTextFromBuffer(buffer, fileName, mimeType) {
  const ext = fileName.split('.').pop().toLowerCase();
  const rawString = buffer.toString('utf-8');

  if (ext === 'eml') {
    // Basic EML parsing (headers + body text)
    const lines = rawString.split(/\r?\n/);
    const headers = [];
    const body = [];
    let inHeader = true;

    lines.forEach(line => {
      if (inHeader) {
        if (line.trim() === '') inHeader = false;
        else if (line.match(/^(From|To|Subject|Date):/i)) headers.push(line);
      } else {
        body.push(line);
      }
    });

    return `[EML Headers]\n${headers.join('\n')}\n\n[EML Content]\n${body.join('\n')}`;
  }

  // General text extraction fallback for PDF/DOCX/TXT text buffers
  return rawString.replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Clean & Parse JSON from AI response with robust rule fallbacks
 */
function parseBriefingJSON(aiResponseText, rawText) {
  let parsed = null;

  try {
    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('[EmailBriefingService] Could not parse LLM JSON output, utilizing fallback heuristic parser.');
  }

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const estTime = Math.ceil((wordCount / 200) * 60);

  // Extract URLs from raw text
  const urlRegex = /(https?:\/\/[^\s]+|meet\.google\.com\/[^\s]+|zoom\.us\/[^\s]+|teams\.microsoft\.com\/[^\s]+)/gi;
  const extractedLinks = (rawText.match(urlRegex) || []).slice(0, 5);

  // Extract Dates from raw text
  const dateRegex = /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|Tomorrow|Friday|Monday|Today)\b/gi;
  const extractedDates = (rawText.match(dateRegex) || []).slice(0, 4);

  // Default fallback data matching strict structure
  return {
    summary: parsed?.summary || `Executive Briefing: Email contains ${wordCount} words addressing key communication points. Main details extracted below.`,
    purpose: parsed?.purpose || (rawText.toLowerCase().includes('meeting') ? 'Meeting Invitation' : rawText.toLowerCase().includes('invoice') ? 'Invoice' : 'Project Update'),
    sender: {
      name: parsed?.sender?.name || (rawText.match(/From:\s*([^\n<]+)/i)?.[1]?.trim() || 'Not Mentioned'),
      email: parsed?.sender?.email || (rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)?.[0] || 'Not Mentioned'),
      organization: parsed?.sender?.organization || 'Not Mentioned'
    },
    recipient: {
      name: parsed?.recipient?.name || (rawText.match(/To:\s*([^\n<]+)/i)?.[1]?.trim() || 'Not Mentioned'),
      email: parsed?.recipient?.email || 'Not Mentioned'
    },
    subject: parsed?.subject || (rawText.match(/Subject:\s*([^\n]+)/i)?.[1]?.trim() || 'No Subject'),
    priority: parsed?.priority || (rawText.toLowerCase().includes('urgent') || rawText.toLowerCase().includes('asap') ? '🔴 High' : '🟡 Medium'),
    deadlines: Array.isArray(parsed?.deadlines) && parsed.deadlines.length > 0 ? parsed.deadlines : (rawText.match(/\b(before|by|due|deadline)\s+[^\n.,]+/gi) || ['Not Mentioned']),
    importantDates: Array.isArray(parsed?.importantDates) && parsed.importantDates.length > 0 ? parsed.importantDates : (extractedDates.length > 0 ? extractedDates : ['Not Mentioned']),
    tasks: Array.isArray(parsed?.tasks) && parsed.tasks.length > 0 ? parsed.tasks : ['Review email content', 'Acknowledge receipt if necessary'],
    questions: Array.isArray(parsed?.questions) && parsed.questions.length > 0 ? parsed.questions : (rawText.match(/[^.!?]*\?/g) || ['Not Mentioned']),
    links: Array.isArray(parsed?.links) && parsed.links.length > 0 ? parsed.links : (extractedLinks.length > 0 ? extractedLinks : []),
    attachmentsMentioned: Array.isArray(parsed?.attachmentsMentioned) && parsed.attachmentsMentioned.length > 0 ? parsed.attachmentsMentioned : (/attached|attachment|see file/i.test(rawText) ? ['Attachment referenced in text'] : []),
    calendarEvents: Array.isArray(parsed?.calendarEvents) && parsed.calendarEvents.length > 0 ? parsed.calendarEvents : (rawText.toLowerCase().includes('meeting') ? [{ title: 'Suggested Discussion / Meeting', date: 'Inferred Date', time: '10:00 AM', reminder: '15 mins before' }] : []),
    replyRequired: parsed?.replyRequired || {
      required: /reply|respond|let me know|confirm/i.test(rawText),
      reason: /reply|respond/i.test(rawText) ? 'Sender requested confirmation or response.' : 'Informational email notification.'
    },
    category: parsed?.category || 'Work',
    riskLevel: parsed?.riskLevel || (/password|wire|credit card/i.test(rawText) ? 'Warning' : 'Safe'),
    readingTime: parsed?.readingTime || `${estTime} sec`,
    recommendations: Array.isArray(parsed?.recommendations) && parsed.recommendations.length > 0 ? parsed.recommendations : ['Review key points', 'Create task reminders for action items'],
    keyHighlights: Array.isArray(parsed?.keyHighlights) && parsed.keyHighlights.length > 0 ? parsed.keyHighlights : rawText.split(/(?<=[.!?])\s+/).slice(0, 3)
  };
}

export default emailBriefingService;
