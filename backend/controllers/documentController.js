import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import DocumentService from '../services/document/DocumentService.js';
import AiDocumentService from '../services/document/AiDocumentService.js';

/**
 * @desc    Enhances text content using Gemini 2.5 Flash
 * @route   POST /api/document/enhance
 * @access  Public / Private
 */
export const enhanceContent = asyncHandler(async (req, res) => {
  const { content, enhancementType } = req.body;
  if (!content || typeof content !== 'string') {
    throw ApiError.badRequest('Document content is required.');
  }

  const enhancedText = await AiDocumentService.enhanceContent(content, enhancementType);
  return res.status(200).json({
    success: true,
    data: { content: enhancedText }
  });
});

/**
 * @desc    Generates base64 PDF & DOCX binaries along with metadata
 * @route   POST /api/document/generate-all
 * @access  Public / Private
 */
export const generateAll = asyncHandler(async (req, res) => {
  const result = await DocumentService.processDocument(req.body);
  return res.status(200).json({
    success: true,
    message: 'Document generated successfully.',
    data: result
  });
});

/**
 * @desc    Generates and downloads PDF binary file
 * @route   POST /api/document/generate-pdf
 * @access  Public / Private
 */
export const downloadPdf = asyncHandler(async (req, res) => {
  const pdfBuffer = DocumentService.generatePdf(req.body);
  const fileName = `${(req.body.title || 'document').replace(/[^a-z0-9]/gi, '_')}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  return res.send(pdfBuffer);
});

/**
 * @desc    Generates and downloads Microsoft Word (.docx) binary file
 * @route   POST /api/document/generate-docx
 * @access  Public / Private
 */
export const downloadDocx = asyncHandler(async (req, res) => {
  const docxBuffer = await DocumentService.generateDocx(req.body);
  const fileName = `${(req.body.title || 'document').replace(/[^a-z0-9]/gi, '_')}.docx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  return res.send(docxBuffer);
});
