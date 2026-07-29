import DocumentDTO from './dtos/DocumentDTO.js';
import DocumentResponseDTO from './dtos/DocumentResponseDTO.js';
import AiDocumentService from './AiDocumentService.js';
import PdfGenerationService from './PdfGenerationService.js';
import WordGenerationService from './WordGenerationService.js';

export class DocumentService {
  /**
   * Enhances text content if requested, then generates PDF and/or DOCX document binaries.
   * @param {Object} rawData 
   * @returns {Promise<DocumentResponseDTO>}
   */
  static async processDocument(rawData) {
    const docDto = new DocumentDTO(rawData);

    // 1. Optional AI Content Enhancement (Gemini 2.5 Flash)
    if (docDto.enhancementType) {
      docDto.content = await AiDocumentService.enhanceContent(docDto.content, docDto.enhancementType);
    }

    // 2. Generate PDF Binary
    const pdfBuffer = PdfGenerationService.generatePdfBuffer(docDto);
    const pdfBase64 = pdfBuffer.toString('base64');

    // 3. Generate DOCX Binary
    const docxBuffer = await WordGenerationService.generateDocxBuffer(docDto);
    const docxBase64 = docxBuffer.toString('base64');

    return new DocumentResponseDTO({
      title: docDto.title,
      content: docDto.content,
      pdfBase64,
      docxBase64,
      metadata: {
        author: docDto.author,
        generatedDate: new Date().toISOString(),
        generatedBy: 'TaskPilot AI Document Generator',
        fontFamily: docDto.fontFamily,
        fontSize: docDto.fontSize
      }
    });
  }

  /**
   * Generates only PDF binary stream.
   */
  static generatePdf(rawData) {
    const docDto = new DocumentDTO(rawData);
    return PdfGenerationService.generatePdfBuffer(docDto);
  }

  /**
   * Generates only Word (.docx) binary stream.
   */
  static generateDocx(rawData) {
    const docDto = new DocumentDTO(rawData);
    return WordGenerationService.generateDocxBuffer(docDto);
  }
}

export default DocumentService;
