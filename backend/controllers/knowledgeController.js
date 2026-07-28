import KnowledgeNote from '../models/KnowledgeNote.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';

/**
 * @desc    Create a new study note manual entry
 * @route   POST /api/knowledge/create
 * @access  Private
 */
export const createNote = asyncHandler(async (req, res, next) => {
  const { 
    title, topic, keywords, description, content, summary, 
    category, tags, difficulty, language, status, isPinned, isFavorite 
  } = req.body;

  const note = await KnowledgeNote.create({
    userId: req.user._id,
    title,
    topic,
    keywords: keywords || [],
    description: description || '',
    content,
    summary: summary || '',
    category: category || 'General',
    tags: tags || [],
    difficulty: difficulty || 'intermediate',
    language: language || 'English',
    status: status || 'saved',
    isPinned: !!isPinned,
    isFavorite: !!isFavorite
  });

  return ApiResponse.created(res, note, 'Study note saved successfully');
});

/**
 * @desc    Simulate AI Note generation pipeline
 * @route   POST /api/knowledge/generate
 * @access  Private
 */
export const generateNote = asyncHandler(async (req, res, next) => {
  const { title, topic, keywords, description, category, tags, difficulty, language } = req.body;

  const keywordList = Array.isArray(keywords) 
    ? keywords 
    : String(keywords).split(',').map(s => s.trim()).filter(Boolean);

  const tagsList = Array.isArray(tags) 
    ? tags 
    : (tags ? String(tags).split(',').map(s => s.trim()).filter(Boolean) : []);

  // Compile high-fidelity visual markdown placeholder body
  const generatedContent = `### 📚 ${title} Summary Guide

This guide details the core principles of **${topic}**, focusing on key terms: *${keywordList.join(', ')}*.

#### 🔍 Core Concepts Explained
The subject addresses multiple layered components:
- **Core Node**: Primary operational parameter.
- **Secondary Node**: Interconnected structural elements.

#### 📊 Analytical Comparison Table
| Part | Configuration | Key Function |
| :--- | :--- | :--- |
| **Component Alpha** | High Speed | Controls initial signal conversions |
| **Component Beta** | Redundant | Manages backup integrity pipelines |
| **Component Gamma** | Multi-Agent | Distributes workloads queries |

> [!NOTE]
> Study Tip: Review oxidative gradients details during morning hours to improve memory retention metrics by 22%.

#### 🔬 Equations Blueprint
The mathematical representation is modeled as:
$$ E = mc^2 $$

*Future visual flowcharts and mindmaps will render here once the Creative sub-agent is wired up.*`;

  const generatedSummary = `A detailed study guide mapping ${topic} core structures, comparisons, and study tips.`;

  const note = await KnowledgeNote.create({
    userId: req.user._id,
    title,
    topic,
    keywords: keywordList,
    description: description || '',
    content: generatedContent,
    summary: generatedSummary,
    category: category || 'General',
    tags: tagsList,
    difficulty: difficulty || 'intermediate',
    language: language || 'English',
    status: 'generated',
    isPinned: false,
    isFavorite: false
  });

  return ApiResponse.created(res, note, 'AI Note successfully generated and logged in Studio');
});

/**
 * @desc    Fetch all notes for active User with filters and sorting
 * @route   GET /api/knowledge/all
 * @access  Private
 */
export const getAllNotes = asyncHandler(async (req, res, next) => {
  const { category, isPinned, isFavorite, sortBy } = req.query;

  const query = { userId: req.user._id };

  if (category) query.category = category;
  if (isPinned !== undefined) query.isPinned = isPinned === 'true';
  if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';

  let sortCriteria = { createdAt: -1 }; // Default: Newest

  if (sortBy === 'oldest') {
    sortCriteria = { createdAt: 1 };
  } else if (sortBy === 'pinned') {
    sortCriteria = { isPinned: -1, createdAt: -1 };
  } else if (sortBy === 'favorites') {
    sortCriteria = { isFavorite: -1, createdAt: -1 };
  }

  const notes = await KnowledgeNote.find(query).sort(sortCriteria);
  return ApiResponse.success(res, notes, 'Operator notes retrieved');
});

/**
 * @desc    Get single note by ID
 * @route   GET /api/knowledge/:id
 * @access  Private
 */
export const getNoteById = asyncHandler(async (req, res, next) => {
  const note = await KnowledgeNote.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!note) {
    return next(ApiError.notFound('Study note document not found.'));
  }

  return ApiResponse.success(res, note, 'Note document fetched');
});

/**
 * @desc    Update an existing study note
 * @route   PUT /api/knowledge/update
 * @access  Private
 */
export const updateNote = asyncHandler(async (req, res, next) => {
  const { id, title, topic, keywords, description, content, summary, category, tags, difficulty, language, status, isPinned, isFavorite } = req.body;

  const note = await KnowledgeNote.findOne({ _id: id, userId: req.user._id });
  if (!note) {
    return next(ApiError.notFound('Study note document not found.'));
  }

  if (title) note.title = title;
  if (topic) note.topic = topic;
  if (keywords !== undefined) note.keywords = keywords;
  if (description !== undefined) note.description = description;
  if (content) note.content = content;
  if (summary !== undefined) note.summary = summary;
  if (category) note.category = category;
  if (tags !== undefined) note.tags = tags;
  if (difficulty) note.difficulty = difficulty;
  if (language) note.language = language;
  if (status) note.status = status;
  if (isPinned !== undefined) note.isPinned = !!isPinned;
  if (isFavorite !== undefined) note.isFavorite = !!isFavorite;

  await note.save();

  return ApiResponse.success(res, note, 'Note document updated successfully');
});

/**
 * @desc    Delete a study note
 * @route   DELETE /api/knowledge/delete
 * @access  Private
 */
export const deleteNote = asyncHandler(async (req, res, next) => {
  const id = req.body.id || req.query.id;

  if (!id) {
    return next(ApiError.badRequest('Note document ID parameter is required'));
  }

  const note = await KnowledgeNote.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!note) {
    return next(ApiError.notFound('Study note document not found.'));
  }

  return ApiResponse.success(res, { id }, 'Note deleted successfully');
});

/**
 * @desc    Toggle favorite flag
 * @route   PUT /api/knowledge/favorite
 * @access  Private
 */
export const toggleFavorite = asyncHandler(async (req, res, next) => {
  const { id, isFavorite } = req.body;

  const note = await KnowledgeNote.findOne({ _id: id, userId: req.user._id });
  if (!note) {
    return next(ApiError.notFound('Note document not found'));
  }

  note.isFavorite = isFavorite !== undefined ? !!isFavorite : !note.isFavorite;
  await note.save();

  return ApiResponse.success(res, note, 'Favorite status updated');
});

/**
 * @desc    Toggle pin flag
 * @route   PUT /api/knowledge/pin
 * @access  Private
 */
export const togglePin = asyncHandler(async (req, res, next) => {
  const { id, isPinned } = req.body;

  const note = await KnowledgeNote.findOne({ _id: id, userId: req.user._id });
  if (!note) {
    return next(ApiError.notFound('Note document not found'));
  }

  note.isPinned = isPinned !== undefined ? !!isPinned : !note.isPinned;
  await note.save();

  return ApiResponse.success(res, note, 'Pin status updated');
});

/**
 * @desc    Search notes matching keywords
 * @route   GET /api/knowledge/search
 * @access  Private
 */
export const searchNotes = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(ApiError.badRequest('Search query is required'));
  }

  const notes = await KnowledgeNote.find({
    userId: req.user._id,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { topic: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } },
      { tags: { $in: [new RegExp(query, 'i')] } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });

  return ApiResponse.success(res, notes, 'Notes search complete');
});
export default { createNote, generateNote, getAllNotes, getNoteById, updateNote, deleteNote, toggleFavorite, togglePin, searchNotes };
