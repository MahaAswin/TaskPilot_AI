import express from 'express';
import multer from 'multer';
import { enhanceContent, generateAll, downloadPdf, downloadDocx } from '../controllers/documentController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/document/enhance - Gemini AI content enhancement
router.post('/enhance', enhanceContent);

// POST /api/document/generate-all - Process document, returns JSON with base64 PDF & DOCX
router.post('/generate-all', upload.single('docFile'), generateAll);

// POST /api/document/generate-pdf - Download PDF binary directly
router.post('/generate-pdf', downloadPdf);

// POST /api/document/generate-docx - Download DOCX binary directly
router.post('/generate-docx', downloadDocx);

export default router;
