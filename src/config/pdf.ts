/**
 * PDF Generation Configuration
 * Configuration for PDF generation using pdfmake
 */

import PdfPrinter from 'pdfmake';
import path from 'path';
import { promises as fs } from 'fs';
import config from './env';

// Fonts configuration
// You can add custom fonts here
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../../public/fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../../public/fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../../public/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../public/fonts/Roboto-MediumItalic.ttf'),
  },
};

// Default PDF configuration
const defaultPdfConfig = {
  // Page size options: 'A4', 'LETTER', 'LEGAL', etc.
  pageSize: config.PDF_PAGE_SIZE || 'A4',

  // Page orientation: 'portrait' or 'landscape'
  pageOrientation: config.PDF_ORIENTATION || 'portrait',

  // Page margins (in points: 1 inch = 72 points)
  pageMargins: config.PDF_MARGINS
    ? JSON.parse(config.PDF_MARGINS)
    : [40, 60, 40, 60], // [left, top, right, bottom]

  // Default font
  defaultStyle: {
    font: 'Roboto',
    fontSize: config.PDF_FONT_SIZE || 12,
    lineHeight: config.PDF_LINE_HEIGHT || 1.2,
  },

  // Header and footer configuration
  header: {
    height: config.PDF_HEADER_HEIGHT || 60,
    margin: [40, 20, 40, 0],
  },

  footer: {
    height: config.PDF_FOOTER_HEIGHT || 60,
    margin: [40, 0, 40, 20],
  },

  // Watermark configuration
  watermark: {
    text: config.PDF_WATERMARK_TEXT || '',
    opacity: config.PDF_WATERMARK_OPACITY || 0.1,
    angle: config.PDF_WATERMARK_ANGLE || 45,
  },

  // Compression
  compress: config.PDF_COMPRESS === 'true' || false,

  // Metadata
  info: {
    title: config.PDF_DEFAULT_TITLE || 'Generated Document',
    author: config.PDF_DEFAULT_AUTHOR || 'API',
    subject: config.PDF_DEFAULT_SUBJECT || '',
    keywords: config.PDF_DEFAULT_KEYWORDS || '',
    creator: config.PDF_DEFAULT_CREATOR || 'Node.js API',
  },
};

// Initialize PDF printer
const printer = new PdfPrinter(fonts);

interface PDFDocumentDefinition {
  content?: any[];
  styles?: Record<string, any>;
  defaultStyle?: Record<string, any>;
  header?: any;
  footer?: any;
  pageSize?: string;
  pageOrientation?: string;
  pageMargins?: number[];
  info?: Record<string, string>;
}

/**
 * Generate PDF from document definition
 */
const generatePDF = (docDefinition: PDFDocumentDefinition, options: Record<string, any> = {}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Merge default config with custom options
      const mergedDefinition = {
        ...defaultPdfConfig,
        ...docDefinition,
        content: docDefinition.content || [],
        info: {
          ...defaultPdfConfig.info,
          ...(docDefinition.info || {}),
        },
      };
      const pdfDoc = printer.createPdfKitDocument(
        mergedDefinition as any,
        options,
      );

      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate PDF and save to file
 */
const generatePDFToFile = async (
  docDefinition: PDFDocumentDefinition,
  filePath: string,
  options: Record<string, any> = {},
): Promise<string> => {
  // Validate file path
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path provided');
  }

  // Resolve to absolute path to prevent directory traversal
  const resolvedPath = path.resolve(filePath);

  const pdfBuffer = await generatePDF(docDefinition, options);
  await fs.writeFile(resolvedPath, pdfBuffer);
  return resolvedPath;
};

/**
 * Create a simple PDF document definition
 */
const createDocumentDefinition = (content: PDFDocumentDefinition): PDFDocumentDefinition => ({
  content: content.content || [],
  styles: content.styles || {},
  defaultStyle: {
    ...defaultPdfConfig.defaultStyle,
    ...(content.defaultStyle || {}),
  },
  header: content.header || defaultPdfConfig.header,
  footer: content.footer || defaultPdfConfig.footer,
  pageSize: content.pageSize || defaultPdfConfig.pageSize,
  pageOrientation: content.pageOrientation || defaultPdfConfig.pageOrientation,
  pageMargins: content.pageMargins || defaultPdfConfig.pageMargins,
  info: {
    ...defaultPdfConfig.info,
    ...(content.info || {}),
  },
});

export {
  printer,
  fonts,
  defaultPdfConfig,
  generatePDF,
  generatePDFToFile,
  createDocumentDefinition,
};

