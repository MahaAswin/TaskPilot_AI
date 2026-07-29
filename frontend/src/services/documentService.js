import axios from 'axios';

const BASE_URL = '/document';

export const documentService = {
  /**
   * Enhances text content using Gemini 2.5 Flash / AI Provider Chain.
   */
  enhanceContent: async (content, enhancementType) => {
    try {
      const response = await axios.post(`${BASE_URL}/enhance`, { content, enhancementType });
      return response.data?.data?.content || content;
    } catch (error) {
      console.warn('[documentService] enhanceContent API fallback:', error?.message);
      return content;
    }
  },

  /**
   * Generates document JSON containing base64 PDF and DOCX binaries.
   */
  generateAll: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate-all`, payload);
      return response.data?.data;
    } catch (error) {
      console.warn('[documentService] generateAll API fallback:', error?.message);
      return {
        title: payload.title || 'Untitled Document',
        content: payload.content || '',
        pdfBase64: null,
        docxBase64: null,
        metadata: { author: payload.author || 'User', generatedDate: new Date().toISOString() }
      };
    }
  },

  /**
   * Direct binary download for PDF file.
   */
  downloadPdf: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate-pdf`, payload, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      triggerBlobDownload(blob, `${(payload.title || 'document').replace(/[^a-z0-9]/gi, '_')}.pdf`);
      return true;
    } catch (error) {
      console.warn('[documentService] downloadPdf blob fallback:', error?.message);
      return false;
    }
  },

  /**
   * Direct binary download for Microsoft Word (.docx) file.
   */
  downloadDocx: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate-docx`, payload, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      triggerBlobDownload(blob, `${(payload.title || 'document').replace(/[^a-z0-9]/gi, '_')}.docx`);
      return true;
    } catch (error) {
      console.warn('[documentService] downloadDocx blob fallback:', error?.message);
      return false;
    }
  }
};

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default documentService;
