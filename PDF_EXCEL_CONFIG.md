# PDF and Excel Generation Configuration

## Overview

This boilerplate includes configuration files for generating PDF and Excel files:

- **PDF Generation**: `src/config/pdf.js` - Uses `pdfmake` library
- **Excel Generation**: `src/config/excel.js` - Uses `exceljs` library

## PDF Generation

### Configuration File: `src/config/pdf.js`

#### Features:
- ✅ Document generation with customizable layouts
- ✅ Header and footer support
- ✅ Watermark support
- ✅ Custom fonts (Roboto included)
- ✅ Metadata configuration
- ✅ Compression support

#### Usage Example:

```javascript
const { generatePDF, createDocumentDefinition } = require('../config/pdf');

// Create document definition
const docDefinition = createDocumentDefinition({
  content: [
    { text: 'Hello World', style: 'header' },
    { text: 'This is a PDF document generated from the API.' },
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
  },
  info: {
    title: 'My Document',
    author: 'API',
  },
});

// Generate PDF buffer
const pdfBuffer = await generatePDF(docDefinition);

// Or save to file
const filePath = await generatePDFToFile(docDefinition, './output.pdf');
```

#### Environment Variables:

```env
# PDF Configuration
PDF_PAGE_SIZE=A4                    # Page size (A4, LETTER, LEGAL, etc.)
PDF_ORIENTATION=portrait             # portrait or landscape
PDF_MARGINS=[40,60,40,60]            # [left, top, right, bottom] in points
PDF_FONT_SIZE=12                     # Default font size
PDF_LINE_HEIGHT=1.2                  # Line height multiplier
PDF_HEADER_HEIGHT=60                  # Header height in points
PDF_FOOTER_HEIGHT=60                  # Footer height in points
PDF_WATERMARK_TEXT=                   # Watermark text (optional)
PDF_WATERMARK_OPACITY=0.1            # Watermark opacity (0-1)
PDF_WATERMARK_ANGLE=45                # Watermark angle in degrees
PDF_COMPRESS=false                    # Enable compression
PDF_DEFAULT_TITLE=Generated Document  # Default document title
PDF_DEFAULT_AUTHOR=API                # Default author
PDF_DEFAULT_SUBJECT=                  # Default subject
PDF_DEFAULT_KEYWORDS=                 # Default keywords
PDF_DEFAULT_CREATOR=Node.js API       # Default creator
```

## Excel Generation

### Configuration File: `src/config/excel.js`

#### Features:
- ✅ Workbook and worksheet creation
- ✅ Custom cell styling
- ✅ Header row styling
- ✅ Page setup and printing options
- ✅ Date, number, and currency formatting
- ✅ Read and write Excel files
- ✅ Buffer support for API responses

#### Usage Example:

```javascript
const {
  createWorkbook,
  createWorksheet,
  applyCellStyle,
  applyHeaderStyle,
  generateExcelBuffer,
} = require('../config/excel');

// Create workbook
const workbook = createWorkbook({
  title: 'My Spreadsheet',
  creator: 'API',
});

// Create worksheet
const worksheet = createWorksheet(workbook, 'Data Sheet');

// Add header row
const headerRow = worksheet.addRow(['Name', 'Email', 'Age']);
applyHeaderStyle(headerRow);

// Add data rows
worksheet.addRow(['John Doe', 'john@example.com', 30]);
worksheet.addRow(['Jane Smith', 'jane@example.com', 25]);

// Apply styles to data rows
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber > 1) {
    row.eachCell((cell) => {
      applyCellStyle(cell);
    });
  }
});

// Generate Excel buffer
const excelBuffer = await generateExcelBuffer(workbook);

// Or save to file
const filePath = await generateExcelFile(workbook, './output.xlsx');
```

#### Environment Variables:

```env
# Excel Configuration
EXCEL_CREATOR=API                     # Workbook creator
EXCEL_MODIFIED_BY=API                 # Last modified by
EXCEL_DEFAULT_TITLE=Generated Spreadsheet
EXCEL_DEFAULT_SUBJECT=
EXCEL_DEFAULT_KEYWORDS=
EXCEL_DEFAULT_CATEGORY=Data
EXCEL_ROW_HEIGHT=20                   # Default row height
EXCEL_COL_WIDTH=15                    # Default column width
EXCEL_PAPER_SIZE=9                     # Paper size (9 = A4)
EXCEL_ORIENTATION=portrait             # portrait or landscape
EXCEL_FIT_TO_PAGE=false               # Fit to page
EXCEL_FIT_TO_WIDTH=1                  # Fit to width
EXCEL_FIT_TO_HEIGHT=0                 # Fit to height
EXCEL_HORIZONTAL_CENTERED=false       # Horizontal centering
EXCEL_VERTICAL_CENTERED=false         # Vertical centering
EXCEL_MARGIN_LEFT=0.7                 # Left margin (inches)
EXCEL_MARGIN_RIGHT=0.7                # Right margin
EXCEL_MARGIN_TOP=0.75                 # Top margin
EXCEL_MARGIN_BOTTOM=0.75              # Bottom margin
EXCEL_MARGIN_HEADER=0.3               # Header margin
EXCEL_MARGIN_FOOTER=0.3               # Footer margin
EXCEL_FONT_NAME=Calibri               # Default font name
EXCEL_FONT_SIZE=11                    # Default font size
EXCEL_FONT_COLOR=FF000000             # Font color (ARGB)
EXCEL_VERTICAL_ALIGN=middle           # Vertical alignment
EXCEL_HORIZONTAL_ALIGN=left          # Horizontal alignment
EXCEL_WRAP_TEXT=false                 # Wrap text
EXCEL_HEADER_FONT_NAME=Calibri         # Header font name
EXCEL_HEADER_FONT_SIZE=12             # Header font size
EXCEL_HEADER_FONT_COLOR=FFFFFFFF      # Header font color
EXCEL_HEADER_BG_COLOR=FF4472C4        # Header background color
EXCEL_DATE_FORMAT=dd/mm/yyyy          # Date format
EXCEL_NUMBER_FORMAT=#,##0.00          # Number format
EXCEL_CURRENCY_FORMAT="$"#,##0.00     # Currency format
```

## Installation

The required packages are already included in `package.json`:

```bash
npm install
```

This will install:
- `pdfmake` - PDF generation library
- `exceljs` - Excel generation library

## Fonts for PDF

For PDF generation, you may need to add font files. The default configuration expects Roboto fonts in `public/fonts/`:

```
public/
└── fonts/
    ├── Roboto-Regular.ttf
    ├── Roboto-Medium.ttf
    ├── Roboto-Italic.ttf
    └── Roboto-MediumItalic.ttf
```

You can download Roboto fonts from [Google Fonts](https://fonts.google.com/specimen/Roboto) or use any other fonts by updating the font configuration in `src/config/pdf.js`.

## API Integration Example

### PDF Generation Endpoint:

```javascript
// In v1.0/controller/reports.js
const { generatePDF, createDocumentDefinition } = require('../../config/pdf');
const asyncHandler = require('../../utilities/asyncHandler');
const { sendSuccess } = require('../../utilities/response');

const generateReportPDF = asyncHandler(async (req, res) => {
  const docDefinition = createDocumentDefinition({
    content: [
      { text: 'Report Title', style: 'header' },
      { text: 'Report content here...' },
    ],
  });

  const pdfBuffer = await generatePDF(docDefinition);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  res.send(pdfBuffer);
});
```

### Excel Generation Endpoint:

```javascript
// In v1.0/controller/reports.js
const {
  createWorkbook,
  createWorksheet,
  generateExcelBuffer,
} = require('../../config/excel');
const asyncHandler = require('../../utilities/asyncHandler');

const generateReportExcel = asyncHandler(async (req, res) => {
  const workbook = createWorkbook({ title: 'Report' });
  const worksheet = createWorksheet(workbook, 'Data');
  
  // Add data...
  worksheet.addRow(['Column 1', 'Column 2']);
  worksheet.addRow(['Value 1', 'Value 2']);

  const excelBuffer = await generateExcelBuffer(workbook);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
  res.send(excelBuffer);
});
```

## Best Practices

1. **Memory Management**: For large files, consider streaming instead of buffering
2. **Error Handling**: Always wrap PDF/Excel generation in try-catch blocks
3. **File Cleanup**: Delete temporary files after sending to client
4. **Caching**: Cache generated files if they don't change frequently
5. **Validation**: Validate input data before generating documents

## Additional Resources

- [pdfmake Documentation](http://pdfmake.org/)
- [ExcelJS Documentation](https://github.com/exceljs/exceljs)

