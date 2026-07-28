import express from 'express';
import { 
  generateImage, 
  generateFlowchart, 
  generateMindmap, 
  generateDiagram, 
  generateInfographic, 
  getHistory, 
  getTemplates, 
  getCollections, 
  createCollection, 
  toggleFavorite, 
  deleteAsset 
} from '../controllers/creativeController.js';
import { 
  imageValidator, 
  flowchartValidator, 
  mindmapValidator, 
  collectionValidator 
} from '../validators/creativeValidator.js';
import validateFields from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure routes using active auth middleware

router.post('/generate-image', imageValidator, validateFields, generateImage);
router.post('/generate-flowchart', flowchartValidator, validateFields, generateFlowchart);
router.post('/generate-mindmap', mindmapValidator, validateFields, generateMindmap);
router.post('/generate-diagram', generateDiagram);
router.post('/generate-infographic', generateInfographic);
router.get('/history', getHistory);
router.get('/templates', getTemplates);
router.get('/collections', getCollections);
router.post('/collections', collectionValidator, validateFields, createCollection);
router.put('/favorite', toggleFavorite);
router.delete('/delete', deleteAsset);

export default router;
