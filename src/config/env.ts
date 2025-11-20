import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
];

// Cloudinary is optional - only required if using file uploads
// Optional env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV || '')) {
    throw new Error(
      `NODE_ENV must be one of: ${validEnvs.join(', ')}`,
    );
  }
};

// Validate on load
try {
  validateEnv();
} catch (error) {
  const err = error as Error;
  console.error('Environment validation failed:', err.message);
  process.exit(1);
}

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'uploads',

  // PDF Generation Configuration
  PDF_PAGE_SIZE: process.env.PDF_PAGE_SIZE || 'A4',
  PDF_ORIENTATION: process.env.PDF_ORIENTATION || 'portrait',
  PDF_MARGINS: process.env.PDF_MARGINS,
  PDF_FONT_SIZE: parseInt(process.env.PDF_FONT_SIZE || '12', 10),
  PDF_LINE_HEIGHT: parseFloat(process.env.PDF_LINE_HEIGHT || '1.2'),
  PDF_HEADER_HEIGHT: parseInt(process.env.PDF_HEADER_HEIGHT || '60', 10),
  PDF_FOOTER_HEIGHT: parseInt(process.env.PDF_FOOTER_HEIGHT || '60', 10),
  PDF_WATERMARK_TEXT: process.env.PDF_WATERMARK_TEXT || '',
  PDF_WATERMARK_OPACITY: parseFloat(process.env.PDF_WATERMARK_OPACITY || '0.1'),
  PDF_WATERMARK_ANGLE: parseInt(process.env.PDF_WATERMARK_ANGLE || '45', 10),
  PDF_COMPRESS: process.env.PDF_COMPRESS || 'false',
  PDF_DEFAULT_TITLE: process.env.PDF_DEFAULT_TITLE || 'Generated Document',
  PDF_DEFAULT_AUTHOR: process.env.PDF_DEFAULT_AUTHOR || 'API',
  PDF_DEFAULT_SUBJECT: process.env.PDF_DEFAULT_SUBJECT || '',
  PDF_DEFAULT_KEYWORDS: process.env.PDF_DEFAULT_KEYWORDS || '',
  PDF_DEFAULT_CREATOR: process.env.PDF_DEFAULT_CREATOR || 'Node.js API',

  // Excel Generation Configuration
  EXCEL_CREATOR: process.env.EXCEL_CREATOR || 'API',
  EXCEL_MODIFIED_BY: process.env.EXCEL_MODIFIED_BY || 'API',
  EXCEL_DEFAULT_TITLE: process.env.EXCEL_DEFAULT_TITLE || 'Generated Spreadsheet',
  EXCEL_DEFAULT_SUBJECT: process.env.EXCEL_DEFAULT_SUBJECT || '',
  EXCEL_DEFAULT_KEYWORDS: process.env.EXCEL_DEFAULT_KEYWORDS || '',
  EXCEL_DEFAULT_CATEGORY: process.env.EXCEL_DEFAULT_CATEGORY || 'Data',
  EXCEL_ROW_HEIGHT: parseInt(process.env.EXCEL_ROW_HEIGHT || '20', 10),
  EXCEL_COL_WIDTH: parseInt(process.env.EXCEL_COL_WIDTH || '15', 10),
  EXCEL_PAPER_SIZE: parseInt(process.env.EXCEL_PAPER_SIZE || '9', 10), // A4
  EXCEL_ORIENTATION: process.env.EXCEL_ORIENTATION || 'portrait',
  EXCEL_FIT_TO_PAGE: process.env.EXCEL_FIT_TO_PAGE || 'false',
  EXCEL_FIT_TO_WIDTH: parseInt(process.env.EXCEL_FIT_TO_WIDTH || '1', 10),
  EXCEL_FIT_TO_HEIGHT: parseInt(process.env.EXCEL_FIT_TO_HEIGHT || '0', 10),
  EXCEL_HORIZONTAL_CENTERED: process.env.EXCEL_HORIZONTAL_CENTERED || 'false',
  EXCEL_VERTICAL_CENTERED: process.env.EXCEL_VERTICAL_CENTERED || 'false',
  EXCEL_MARGIN_LEFT: parseFloat(process.env.EXCEL_MARGIN_LEFT || '0.7'),
  EXCEL_MARGIN_RIGHT: parseFloat(process.env.EXCEL_MARGIN_RIGHT || '0.7'),
  EXCEL_MARGIN_TOP: parseFloat(process.env.EXCEL_MARGIN_TOP || '0.75'),
  EXCEL_MARGIN_BOTTOM: parseFloat(process.env.EXCEL_MARGIN_BOTTOM || '0.75'),
  EXCEL_MARGIN_HEADER: parseFloat(process.env.EXCEL_MARGIN_HEADER || '0.3'),
  EXCEL_MARGIN_FOOTER: parseFloat(process.env.EXCEL_MARGIN_FOOTER || '0.3'),
  EXCEL_FONT_NAME: process.env.EXCEL_FONT_NAME || 'Calibri',
  EXCEL_FONT_SIZE: parseInt(process.env.EXCEL_FONT_SIZE || '11', 10),
  EXCEL_FONT_COLOR: process.env.EXCEL_FONT_COLOR || 'FF000000',
  EXCEL_VERTICAL_ALIGN: process.env.EXCEL_VERTICAL_ALIGN || 'middle',
  EXCEL_HORIZONTAL_ALIGN: process.env.EXCEL_HORIZONTAL_ALIGN || 'left',
  EXCEL_WRAP_TEXT: process.env.EXCEL_WRAP_TEXT || 'false',
  EXCEL_HEADER_FONT_NAME: process.env.EXCEL_HEADER_FONT_NAME || 'Calibri',
  EXCEL_HEADER_FONT_SIZE: parseInt(process.env.EXCEL_HEADER_FONT_SIZE || '12', 10),
  EXCEL_HEADER_FONT_COLOR: process.env.EXCEL_HEADER_FONT_COLOR || 'FFFFFFFF',
  EXCEL_HEADER_BG_COLOR: process.env.EXCEL_HEADER_BG_COLOR || 'FF4472C4',
  EXCEL_DATE_FORMAT: process.env.EXCEL_DATE_FORMAT || 'dd/mm/yyyy',
  EXCEL_NUMBER_FORMAT: process.env.EXCEL_NUMBER_FORMAT || '#,##0.00',
  EXCEL_CURRENCY_FORMAT: process.env.EXCEL_CURRENCY_FORMAT || '"$"#,##0.00',
  // Prisma Auto-Migration Configuration
  PRISMA_AUTO_MIGRATE: process.env.PRISMA_AUTO_MIGRATE, // 'true' to enable, 'false' to disable, undefined for default (enabled in dev)
};

export default config;

