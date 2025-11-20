/**
 * Excel Generation Configuration
 * Configuration for Excel file generation using exceljs
 */

import ExcelJS from 'exceljs';
import config from './env';

// Default Excel configuration
const defaultExcelConfig = {
  // Workbook properties
  workbook: {
    creator: config.EXCEL_CREATOR || 'API',
    created: new Date(),
    modified: new Date(),
    lastModifiedBy: config.EXCEL_MODIFIED_BY || 'API',
    title: config.EXCEL_DEFAULT_TITLE || 'Generated Spreadsheet',
    subject: config.EXCEL_DEFAULT_SUBJECT || '',
    keywords: config.EXCEL_DEFAULT_KEYWORDS || '',
    category: config.EXCEL_DEFAULT_CATEGORY || 'Data',
  },
  // Default worksheet settings
  worksheet: {
    properties: {
      defaultRowHeight: config.EXCEL_ROW_HEIGHT || 20,
      defaultColWidth: config.EXCEL_COL_WIDTH || 15,
    },
    pageSetup: {
      paperSize: config.EXCEL_PAPER_SIZE || 9, // A4
      orientation: (config.EXCEL_ORIENTATION || 'portrait') as 'portrait' | 'landscape',
      fitToPage: config.EXCEL_FIT_TO_PAGE === 'true' || false,
      fitToWidth: config.EXCEL_FIT_TO_WIDTH || 1,
      fitToHeight: config.EXCEL_FIT_TO_HEIGHT || 0,
      horizontalCentered: config.EXCEL_HORIZONTAL_CENTERED === 'true' || false,
      verticalCentered: config.EXCEL_VERTICAL_CENTERED === 'true' || false,
      margins: {
        left: config.EXCEL_MARGIN_LEFT || 0.7,
        right: config.EXCEL_MARGIN_RIGHT || 0.7,
        top: config.EXCEL_MARGIN_TOP || 0.75,
        bottom: config.EXCEL_MARGIN_BOTTOM || 0.75,
        header: config.EXCEL_MARGIN_HEADER || 0.3,
        footer: config.EXCEL_MARGIN_FOOTER || 0.3,
      },
    },
  },

  // Default cell styles
  defaultCellStyle: {
    font: {
      name: config.EXCEL_FONT_NAME || 'Calibri',
      size: config.EXCEL_FONT_SIZE || 11,
      bold: false,
      color: { argb: config.EXCEL_FONT_COLOR || 'FF000000' },
    },
    alignment: {
      vertical: (config.EXCEL_VERTICAL_ALIGN || 'middle') as 'top' | 'middle' | 'bottom',
      horizontal: (config.EXCEL_HORIZONTAL_ALIGN || 'left') as 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed',
      wrapText: config.EXCEL_WRAP_TEXT === 'true' || false,
    },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FFD3D3D3' } },
      left: { style: 'thin' as const, color: { argb: 'FFD3D3D3' } },
      bottom: { style: 'thin' as const, color: { argb: 'FFD3D3D3' } },
      right: { style: 'thin' as const, color: { argb: 'FFD3D3D3' } },
    },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFFFFFFF' },
    },
  },

  // Header row style
  headerStyle: {
    font: {
      name: config.EXCEL_HEADER_FONT_NAME || 'Calibri',
      size: config.EXCEL_HEADER_FONT_SIZE || 12,
      bold: true,
      color: { argb: config.EXCEL_HEADER_FONT_COLOR || 'FFFFFFFF' },
    },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: config.EXCEL_HEADER_BG_COLOR || 'FF4472C4' },
    },
    alignment: {
      vertical: 'middle' as const,
      horizontal: 'center' as const,
      wrapText: true,
    },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FF000000' } },
      left: { style: 'thin' as const, color: { argb: 'FF000000' } },
      bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
      right: { style: 'thin' as const, color: { argb: 'FF000000' } },
    },
  },

  // Date format
  dateFormat: config.EXCEL_DATE_FORMAT || 'dd/mm/yyyy',

  // Number format
  numberFormat: config.EXCEL_NUMBER_FORMAT || '#,##0.00',

  // Currency format
  currencyFormat: config.EXCEL_CURRENCY_FORMAT || '"$"#,##0.00',
};

interface WorkbookOptions {
  creator?: string;
  created?: Date;
  modified?: Date;
  lastModifiedBy?: string;
  title?: string;
  subject?: string;
  keywords?: string;
  category?: string;
}

interface WorksheetOptions {
  defaultRowHeight?: number;
  defaultColWidth?: number;
  pageSetup?: Partial<ExcelJS.PageSetup>;
}

/**
 * Create a new Excel workbook
 */
const createWorkbook = (options: WorkbookOptions = {}): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();

  // Set workbook properties
  workbook.creator = options.creator || defaultExcelConfig.workbook.creator;
  workbook.created = options.created || defaultExcelConfig.workbook.created;
  workbook.modified = options.modified || defaultExcelConfig.workbook.modified;
  workbook.lastModifiedBy = options.lastModifiedBy || defaultExcelConfig.workbook.lastModifiedBy;
  workbook.title = options.title || defaultExcelConfig.workbook.title;
  workbook.subject = options.subject || defaultExcelConfig.workbook.subject;
  workbook.keywords = options.keywords || defaultExcelConfig.workbook.keywords;
  workbook.category = options.category || defaultExcelConfig.workbook.category;

  return workbook;
};

/**
 * Create a new worksheet with default settings
 */
const createWorksheet = (workbook: ExcelJS.Workbook, name: string, options: WorksheetOptions = {}): ExcelJS.Worksheet => {
  const worksheet = workbook.addWorksheet(name, {
    properties: {
      defaultRowHeight: options.defaultRowHeight || defaultExcelConfig.worksheet.properties.defaultRowHeight,
      defaultColWidth: options.defaultColWidth || defaultExcelConfig.worksheet.properties.defaultColWidth,
    },
    pageSetup: {
      ...defaultExcelConfig.worksheet.pageSetup,
      ...(options.pageSetup || {}),
    },
  });

  return worksheet;
};

/**
 * Apply default style to a cell
 */
const applyCellStyle = (cell: ExcelJS.Cell, style: Partial<ExcelJS.Style> = {}): void => {
  const cellStyle = {
    ...defaultExcelConfig.defaultCellStyle,
    ...style,
  };

  cell.font = cellStyle.font;
  cell.alignment = cellStyle.alignment;
  cell.border = cellStyle.border;
  cell.fill = cellStyle.fill;

  if (style.numFmt) {
    cell.numFmt = style.numFmt;
  }
};

/**
 * Apply header style to a row
 */
const applyHeaderStyle = (row: ExcelJS.Row): void => {
  row.eachCell((cell) => {
    cell.font = defaultExcelConfig.headerStyle.font;
    cell.fill = defaultExcelConfig.headerStyle.fill;
    cell.alignment = defaultExcelConfig.headerStyle.alignment;
    cell.border = defaultExcelConfig.headerStyle.border;
  });
};

/**
 * Generate Excel buffer from workbook
 */
const generateExcelBuffer = async (workbook: ExcelJS.Workbook): Promise<Buffer> => {
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

/**
 * Generate Excel file from workbook
 */
const generateExcelFile = async (workbook: ExcelJS.Workbook, filePath: string): Promise<string> => {
  await workbook.xlsx.writeFile(filePath);
  return filePath;
};

/**
 * Read Excel file
 */
const readExcelFile = async (filePath: string): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
};

/**
 * Read Excel buffer
 */
const readExcelBuffer = async (buffer: Buffer | ArrayBuffer | Uint8Array): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  return workbook;
};

export {
  ExcelJS,
  defaultExcelConfig,
  createWorkbook,
  createWorksheet,
  applyCellStyle,
  applyHeaderStyle,
  generateExcelBuffer,
  generateExcelFile,
  readExcelFile,
  readExcelBuffer,
};

