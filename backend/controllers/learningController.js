import LearningSession from '../models/LearningSession.js';
import LearningFlashcard from '../models/LearningFlashcard.js';
import LearningQuiz from '../models/LearningQuiz.js';
import LearningBookmark from '../models/LearningBookmark.js';
import LearningHistory from '../models/LearningHistory.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';

/**
 * @desc    Start a new study session
 * @route   POST /api/learning/start
 * @access  Private
 */
export const startSession = asyncHandler(async (req, res, next) => {
  const { topic } = req.body;

  const session = await LearningSession.create({
    userId: req.user._id,
    topic,
    status: 'active',
    progress: 0,
    duration: 0,
    startedAt: new Date()
  });

  return ApiResponse.created(res, session, 'Study session initialized successfully');
});

/**
 * @desc    Continue / update previous study session
 * @route   POST /api/learning/continue
 * @access  Private
 */
export const continueSession = asyncHandler(async (req, res, next) => {
  const { id, progress, duration, isCompleted } = req.body;

  const session = await LearningSession.findOne({ _id: id, userId: req.user._id });
  if (!session) {
    return next(ApiError.notFound('Active study session not found.'));
  }

  if (progress !== undefined) session.progress = progress;
  if (duration !== undefined) session.duration = duration;

  if (isCompleted) {
    session.status = 'completed';
    session.completedAt = new Date();
    
    // Save to user history logs
    await LearningHistory.create({
      userId: req.user._id,
      activityType: 'read',
      topic: session.topic,
      score: progress
    });
  }

  await session.save();

  return ApiResponse.success(res, session, 'Study session updated successfully');
});

/**
 * @desc    Fetch learning history activity logs
 * @route   GET /api/learning/history
 * @access  Private
 */
export const getHistory = asyncHandler(async (req, res, next) => {
  const history = await LearningHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, history, 'Operator study logs retrieved');
});

/**
 * @desc    Fetch bookmarked learning materials
 * @route   GET /api/learning/bookmarks
 * @access  Private
 */
export const getBookmarks = asyncHandler(async (req, res, next) => {
  const bookmarks = await LearningBookmark.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, bookmarks, 'Operator bookmarks retrieved');
});

/**
 * @desc    Toggle bookmark status for learning contents
 * @route   POST /api/learning/bookmark
 * @access  Private
 */
export const toggleBookmark = asyncHandler(async (req, res, next) => {
  const { referenceId, contentType, title } = req.body;

  const existing = await LearningBookmark.findOne({
    userId: req.user._id,
    referenceId,
    contentType
  });

  if (existing) {
    await LearningBookmark.deleteOne({ _id: existing._id });
    return ApiResponse.success(res, { referenceId, bookmarked: false }, 'Bookmark removed');
  }

  const bookmark = await LearningBookmark.create({
    userId: req.user._id,
    contentType,
    title,
    referenceId
  });

  return ApiResponse.created(res, { bookmark, bookmarked: true }, 'Bookmark saved successfully');
});

/**
 * @desc    Get assessment quizzes (MCQs)
 * @route   POST /api/learning/quiz
 * @access  Private
 */
export const getQuizzes = asyncHandler(async (req, res, next) => {
  const { topic } = req.body;

  // Retrieve matching questions or return presets
  const quizzes = await LearningQuiz.find({ userId: req.user._id });
  
  const presets = [
    {
      _id: 'quiz-preset-1',
      question: 'Which of the following is responsible for synthesizing proteins in cells?',
      options: ['Mitochondria', 'Ribosome', 'Lysosome', 'Nucleus'],
      correctIndex: 1
    },
    {
      _id: 'quiz-preset-2',
      question: 'What is the byproduct of glycolysis in anaerobic conditions?',
      options: ['Lactic Acid', 'Ethanol', 'Pyruvic Acid', 'Carbon Dioxide'],
      correctIndex: 0
    },
    {
      _id: 'quiz-preset-3',
      question: 'Which element acts as the terminal electron acceptor during aerobic respiration?',
      options: ['Carbon', 'Hydrogen', 'Oxygen', 'Nitrogen'],
      correctIndex: 2
    }
  ];

  const merged = quizzes.length > 0 ? [...quizzes, ...presets] : presets;
  return ApiResponse.success(res, merged, 'Assessment questions loaded');
});

/**
 * @desc    Get flashcards terms
 * @route   POST /api/learning/flashcards
 * @access  Private
 */
export const getFlashcards = asyncHandler(async (req, res, next) => {
  const { topic } = req.body;

  const cards = await LearningFlashcard.find({ userId: req.user._id });

  const presets = [
    {
      _id: 'flash-preset-1',
      front: 'Oxidative Phosphorylation',
      back: 'The process in which ATP is formed as a result of the transfer of electrons from NADH or FADH2 to O2 by a series of electron carriers.',
      difficulty: 'hard'
    },
    {
      _id: 'flash-preset-2',
      front: 'Matrix Matrix',
      back: 'The fluid-filled internal space of the mitochondria containing enzymes, DNA, ribosomes, and Krebs substrates.',
      difficulty: 'medium'
    },
    {
      _id: 'flash-preset-3',
      front: 'ATP Synthase',
      back: 'A complex enzyme structure that converts the electrochemical energy of a proton gradient into chemical energy in ATP.',
      difficulty: 'easy'
    }
  ];

  const merged = cards.length > 0 ? [...cards, ...presets] : presets;
  return ApiResponse.success(res, merged, 'Study flashcards loaded');
});
export default { startSession, continueSession, getHistory, getBookmarks, toggleBookmark, getQuizzes, getFlashcards };
