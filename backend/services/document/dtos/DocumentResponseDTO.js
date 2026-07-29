/**
 * Data Transfer Object representing document generation response.
 */
export class DocumentResponseDTO {
  constructor({
    title = '',
    content = '',
    pdfBase64 = null,
    docxBase64 = null,
    metadata = {}
  }) {
    this.title = title;
    this.content = content;
    this.pdfBase64 = pdfBase64;
    this.docxBase64 = docxBase64;
    this.metadata = metadata;
  }
}

export default DocumentResponseDTO;
