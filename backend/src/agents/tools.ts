const pdfParse = require('pdf-parse');

/**
 * Extract text from PDF buffer (robust version)
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log('--- PDF EXTRACTION START ---');

  if (!buffer) {
    throw new Error('PDF buffer is missing');
  }

  try {
    // pdf-parse can export in weird shapes depending on TS/Node
    const parser =
      pdfParse?.default ??
      pdfParse?.pdf ??
      pdfParse;

    if (typeof parser !== 'function') {
      throw new Error(
        'PDF parser is not a function. Check pdf-parse installation.'
      );
    }

    const data = await parser(buffer);

    const text = (data?.text || '').trim();

    console.log('Extracted text length:', text.length);

    // Handle scanned PDFs
    if (text.length < 50) {
      return `
ERROR_SCANNED_PDF:
This PDF appears to be scanned or image-based.
Please upload a text-based PDF.
      `.trim();
    }

    return text;
  } catch (err: any) {
    console.error('PDF EXTRACTION ERROR:', err?.message);

    throw new Error(`PDF Read Error: ${err?.message}`);
  }
}