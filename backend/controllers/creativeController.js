import CreativeAsset from '../models/CreativeAsset.js';
import CreativeCollection from '../models/CreativeCollection.js';
import CreativeTemplate from '../models/CreativeTemplate.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';

/**
 * @desc    Generate a mock AI Image asset
 * @route   POST /api/creative/generate-image
 * @access  Private
 */
export const generateImage = asyncHandler(async (req, res, next) => {
  const { prompt, style, size, aspectRatio, quality } = req.body;

  const asset = await CreativeAsset.create({
    userId: req.user._id,
    title: prompt.substring(0, 30) || 'Untitled Image',
    prompt,
    type: 'image',
    category: 'Graphics',
    tags: [style, 'ai_generated'],
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
    isFavorite: false
  });

  return ApiResponse.created(res, asset, 'Image asset generated successfully');
});

/**
 * @desc    Generate a mock AI Flowchart asset
 * @route   POST /api/creative/generate-flowchart
 * @access  Private
 */
export const generateFlowchart = asyncHandler(async (req, res, next) => {
  const { title, topic } = req.body;

  const asset = await CreativeAsset.create({
    userId: req.user._id,
    title,
    prompt: `Generate a flowchart illustrating ${topic}`,
    type: 'flowchart',
    category: 'Flowcharts',
    tags: ['flowchart', 'structure'],
    status: 'completed',
    thumbnail: '',
    fileUrl: '',
    isFavorite: false
  });

  return ApiResponse.created(res, asset, 'Flowchart asset generated successfully');
});

/**
 * @desc    Generate a mock AI Mindmap asset
 * @route   POST /api/creative/generate-mindmap
 * @access  Private
 */
export const generateMindmap = asyncHandler(async (req, res, next) => {
  const { title, topic } = req.body;

  const asset = await CreativeAsset.create({
    userId: req.user._id,
    title,
    prompt: `Generate a mindmap for ${topic}`,
    type: 'mindmap',
    category: 'Mindmaps',
    tags: ['mindmap', 'study'],
    status: 'completed',
    thumbnail: '',
    fileUrl: '',
    isFavorite: false
  });

  return ApiResponse.created(res, asset, 'Mindmap asset generated successfully');
});

/**
 * @desc    Generate a mock AI Diagram asset
 * @route   POST /api/creative/generate-diagram
 * @access  Private
 */
export const generateDiagram = asyncHandler(async (req, res, next) => {
  const { title, topic } = req.body;

  const asset = await CreativeAsset.create({
    userId: req.user._id,
    title,
    prompt: `Generate an architecture diagram of ${topic}`,
    type: 'diagram',
    category: 'Diagrams',
    tags: ['diagram', 'architecture'],
    status: 'completed',
    thumbnail: '',
    fileUrl: '',
    isFavorite: false
  });

  return ApiResponse.created(res, asset, 'Diagram asset generated successfully');
});

/**
 * @desc    Generate a mock AI Infographic asset
 * @route   POST /api/creative/generate-infographic
 * @access  Private
 */
export const generateInfographic = asyncHandler(async (req, res, next) => {
  const { title, category, theme } = req.body;

  const asset = await CreativeAsset.create({
    userId: req.user._id,
    title,
    prompt: `Generate an infographic template for ${title} under theme ${theme}`,
    type: 'infographic',
    category: category || 'Infographics',
    tags: ['infographic', theme],
    status: 'completed',
    thumbnail: '',
    fileUrl: '',
    isFavorite: false
  });

  return ApiResponse.created(res, asset, 'Infographic asset generated successfully');
});

/**
 * @desc    Fetch generated visual history logs
 * @route   GET /api/creative/history
 * @access  Private
 */
export const getHistory = asyncHandler(async (req, res, next) => {
  const assets = await CreativeAsset.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, assets, 'Operator visual history retrieved');
});

/**
 * @desc    Fetch templates gallery presets
 * @route   GET /api/creative/templates
 * @access  Private
 */
export const getTemplates = asyncHandler(async (req, res, next) => {
  const templates = await CreativeTemplate.find();
  
  const presets = [
    { _id: 'temp-1', title: 'System Architecture Blueprint', type: 'diagram', category: 'Tech' },
    { _id: 'temp-2', title: 'Agile Workflow Spiral', type: 'flowchart', category: 'Business' },
    { _id: 'temp-3', title: 'Concept Organization Web', type: 'mindmap', category: 'Study' },
    { _id: 'temp-4', title: 'Mitochondria Infographics layout', type: 'infographic', category: 'Biology' }
  ];

  const merged = templates.length > 0 ? [...templates, ...presets] : presets;
  return ApiResponse.success(res, merged, 'Predefined templates loaded');
});

/**
 * @desc    Fetch custom collections list
 * @route   GET /api/creative/collections
 * @access  Private
 */
export const getCollections = asyncHandler(async (req, res, next) => {
  const collections = await CreativeCollection.find({ userId: req.user._id }).sort({ createdAt: -1 });
  
  const presets = [
    { _id: 'coll-1', name: 'Java Programming', description: 'Visual structures regarding spring framework.' },
    { _id: 'coll-2', name: 'DSA Roadmaps', description: 'Flowcharts mapping algorithmic checkpoints.' }
  ];

  const merged = collections.length > 0 ? [...collections, ...presets] : presets;
  return ApiResponse.success(res, merged, 'Asset collections retrieved');
});

/**
 * @desc    Create a new collection
 * @route   POST /api/creative/collections
 * @access  Private
 */
export const createCollection = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const collection = await CreativeCollection.create({
    userId: req.user._id,
    name,
    description: description || ''
  });

  return ApiResponse.created(res, collection, 'Asset collection created');
});

/**
 * @desc    Toggle favorite flag
 * @route   PUT /api/creative/favorite
 * @access  Private
 */
export const toggleFavorite = asyncHandler(async (req, res, next) => {
  const { id, isFavorite } = req.body;

  const asset = await CreativeAsset.findOne({ _id: id, userId: req.user._id });
  if (!asset) {
    return next(ApiError.notFound('Creative asset not found'));
  }

  asset.isFavorite = isFavorite !== undefined ? !!isFavorite : !asset.isFavorite;
  await asset.save();

  return ApiResponse.success(res, asset, 'Asset favorite flag updated');
});

/**
 * @desc    Delete a generated asset
 * @route   DELETE /api/creative/delete
 * @access  Private
 */
export const deleteAsset = asyncHandler(async (req, res, next) => {
  const id = req.body.id || req.query.id;

  if (!id) {
    return next(ApiError.badRequest('Asset ID is required'));
  }

  const asset = await CreativeAsset.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!asset) {
    return next(ApiError.notFound('Creative asset not found'));
  }

  return ApiResponse.success(res, { id }, 'Asset deleted successfully');
});
export default { generateImage, generateFlowchart, generateMindmap, generateDiagram, generateInfographic, getHistory, getTemplates, getCollections, createCollection, toggleFavorite, deleteAsset };
