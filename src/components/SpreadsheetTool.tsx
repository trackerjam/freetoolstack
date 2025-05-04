import React, { useState, useRef } from 'react';
import { Download, Plus, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type, Palette, Calculator } from 'lucide-react';
import ToolHeader from './ToolHeader';
import * as XLSX from 'xlsx-js-style';

interface Cell {
  value: string;
  formula: string;
  format: {
    bold: boolean;
    italic: boolean;
    align: 'left' | 'center' | 'right';
    color: string;
    background: string;
  };
  calculated?: string | number;
}

export default function SpreadsheetTool() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(6);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [data, setData] = useState<Cell[][]>(
    Array(10).fill(null).map(() => 
      Array(6).fill(null).map(() => ({
        value: '',
        formula: '',
        format: {
          bold: false,
          italic: false,
          align: 'left',
          color: '#000000',
          background: '#ffffff'
        }
      }))
    )
  );

  const getCellValue = (rowIndex: number, colIndex: number): string | number => {
    if (rowIndex < 0 || rowIndex >= data.length || colIndex < 0 || colIndex >= data[0].length) {
      return '#REF!';
    }
    const cell = data[rowIndex][colIndex];
    if (cell.formula) {
      return cell.calculated !== undefined ? cell.calculated : '#ERROR!';
    }
    return cell.value;
  };

  const evaluateFormula = (formula: string, row: number, col: number): number | string => {
    try {
      if (!formula.startsWith('=')) return formula;

      const expression = formula.substring(1).trim();
      
      const evaluatedExpression = expression.replace(/[A-Z]\d+/g, (match) => {
        const colIndex = match.charAt(0).charCodeAt(0) - 65;
        const rowIndex = parseInt(match.substring(1)) - 1;
        
        if (rowIndex === row && colIndex === col) {
          throw new Error('Circular reference');
        }

        const value = getCellValue(rowIndex, colIndex);
        if (typeof value === 'number') {
          return value.toString();
        }
        if (value === '#REF!' || value === '#ERROR!') {
          throw new Error(value);
        }
        return isNaN(Number(value)) ? '0' : value.toString();
      });

      const result = new Function(`return ${evaluatedExpression}`)();
      return typeof result === 'number' ? Number(result.toFixed(2)) : '#ERROR!';
    } catch (error) {
      return error.message === '#REF!' ? '#REF!' : '#ERROR!';
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    const newCell = {
      ...newData[rowIndex][colIndex],
      value,
      formula: value.startsWith('=') ? value : ''
    };

    if (value.startsWith('=')) {
      newCell.calculated = evaluateFormula(value, rowIndex, colIndex);
    } else {
      delete newCell.calculated;
    }

    newData[rowIndex][colIndex] = newCell;

    newData.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.formula && (r !== rowIndex || c !== colIndex)) {
          cell.calculated = evaluateFormula(cell.formula, r, c);
        }
      });
    });

    setData(newData);
  };

  const getCellDisplayValue = (cell: Cell, isEditing: boolean): string => {
    if (isEditing) {
      return cell.formula || cell.value;
    }
    if (cell.formula) {
      return cell.calculated?.toString() || '#ERROR!';
    }
    return cell.value;
  };

  const handleFormatChange = (format: Partial<Cell['format']>) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newData = [...data];
    newData[row][col] = {
      ...newData[row][col],
      format: {
        ...newData[row][col].format,
        ...format
      }
    };
    setData(newData);
  };

  const addRow = () => {
    setRows(prev => prev + 1);
    setData(prev => [
      ...prev,
      Array(cols).fill(null).map(() => ({
        value: '',
        formula: '',
        format: {
          bold: false,
          italic: false,
          align: 'left',
          color: '#000000',
          background: '#ffffff'
        }
      }))
    ]);
  };

  const addColumn = () => {
    setCols(prev => prev + 1);
    setData(prev => prev.map(row => [
      ...row,
      {
        value: '',
        formula: '',
        format: {
          bold: false,
          italic: false,
          align: 'left',
          color: '#000000',
          background: '#ffffff'
        }
      }
    ]));
  };

  const downloadSpreadsheet = () => {
    const wb = XLSX.utils.book_new();
    
    const wsData = data.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        v: cell.calculated !== undefined ? cell.calculated : cell.value,
        t: typeof cell.calculated === 'number' ? 'n' : 's',
        s: {
          font: {
            name: 'Arial',
            bold: cell.format.bold,
            italic: cell.format.italic,
            color: { rgb: cell.format.color.replace('#', '') }
          },
          alignment: {
            horizontal: cell.format.align,
            vertical: 'center',
            wrapText: true
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: cell.format.background.replace('#', '') }
          },
          border: {
            top: { style: 'thin', color: { rgb: 'CCCCCC' } },
            bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
            left: { style: 'thin', color: { rgb: 'CCCCCC' } },
            right: { style: 'thin', color: { rgb: 'CCCCCC' } }
          }
        },
        ...(cell.formula && { f: cell.formula.substring(1) })
      }))
    );

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = Array(cols).fill({ wch: 15 });

    ws['!margins'] = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3
    };

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    wb.Workbook = {
      Views: [{ RTL: false }],
      Sheets: [{ Hidden: 0 }]
    };

    XLSX.writeFile(wb, 'spreadsheet.xlsx', {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Spreadsheet" 
          description="Create and edit spreadsheets online"
        />
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <button
                onClick={() => handleFormatChange({ bold: !data[selectedCell?.row ?? 0][selectedCell?.col ?? 0].format.bold })}
                disabled={!selectedCell}
                className={`p-2 rounded ${
                  selectedCell && data[selectedCell.row][selectedCell.col].format.bold
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormatChange({ italic: !data[selectedCell?.row ?? 0][selectedCell?.col ?? 0].format.italic })}
                disabled={!selectedCell}
                className={`p-2 rounded ${
                  selectedCell && data[selectedCell.row][selectedCell.col].format.italic
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={() => handleFormatChange({ align: 'left' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-gray-200 disabled:opacity-50`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormatChange({ align: 'center' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-gray-200 disabled:opacity-50`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormatChange({ align: 'right' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-gray-200 disabled:opacity-50`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" />
                <input
                  type="color"
                  value={selectedCell ? data[selectedCell.row][selectedCell.col].format.color : '#000000'}
                  onChange={(e) => handleFormatChange({ color: e.target.value })}
                  disabled={!selectedCell}
                  className="w-6 h-6 p-0 border-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" />
                <input
                  type="color"
                  value={selectedCell ? data[selectedCell.row][selectedCell.col].format.background : '#ffffff'}
                  onChange={(e) => handleFormatChange({ background: e.target.value })}
                  disabled={!selectedCell}
                  className="w-6 h-6 p-0 border-0"
                />
              </div>
            </div>
            <div className="flex-1" />
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
            <button
              onClick={addColumn}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Column
            </button>
            <button
              onClick={downloadSpreadsheet}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-10"></th>
                  {Array(cols).fill(null).map((_, i) => (
                    <th key={i} className="border p-2 bg-gray-50 min-w-[100px]">
                      {String.fromCharCode(65 + i)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border p-2 bg-gray-50 text-center text-sm font-medium text-gray-600">
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td 
                        key={colIndex} 
                        className="border p-0 relative group"
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <input
                          type="text"
                          value={getCellDisplayValue(
                            cell,
                            editingCell?.row === rowIndex && editingCell?.col === colIndex
                          )}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          onFocus={() => {
                            setSelectedCell({ row: rowIndex, col: colIndex });
                            setEditingCell({ row: rowIndex, col: colIndex });
                          }}
                          onBlur={() => setEditingCell(null)}
                          className={`w-full p-2 focus:bg-blue-50 outline-none text-${cell.format.align}`}
                          style={{
                            fontWeight: cell.format.bold ? 'bold' : 'normal',
                            fontStyle: cell.format.italic ? 'italic' : 'normal',
                            color: cell.format.color,
                            backgroundColor: cell.format.background
                          }}
                        />
                        {cell.formula && hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                          <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                            {cell.formula}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Formula Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start formulas with = (e.g., =A1+B1)</li>
              <li>• Use cell references (e.g., A1, B2)</li>
              <li>• Supports +, -, *, / operations</li>
              <li>• Example: =A1*B1+C1</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}