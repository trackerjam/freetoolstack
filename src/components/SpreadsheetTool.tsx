import React, { useState } from 'react';
import { Download, Plus, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react';
import ToolHeader from './ToolHeader';

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
}

export default function SpreadsheetTool() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(6);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
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

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      value,
      formula: value.startsWith('=') ? value : ''
    };
    setData(newData);
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
    const csvContent = data
      .map(row => row.map(cell => `"${cell.value}"`).join(','))
      .join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'spreadsheet.xlsx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
              <button
                onClick={() => handleFormatChange({ bold: !data[selectedCell?.row ?? 0][selectedCell?.col ?? 0].format.bold })}
                disabled={!selectedCell}
                className={`p-2 rounded ${
                  selectedCell && data[selectedCell.row][selectedCell.col].format.bold
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-slate-200'
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
                    : 'hover:bg-slate-200'
                } disabled:opacity-50`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-2" />
              <button
                onClick={() => handleFormatChange({ align: 'left' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-slate-200 disabled:opacity-50`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormatChange({ align: 'center' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-slate-200 disabled:opacity-50`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormatChange({ align: 'right' })}
                disabled={!selectedCell}
                className={`p-2 rounded hover:bg-slate-200 disabled:opacity-50`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-2" />
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                <input
                  type="color"
                  value={selectedCell ? data[selectedCell.row][selectedCell.col].format.color : '#000000'}
                  onChange={(e) => handleFormatChange({ color: e.target.value })}
                  disabled={!selectedCell}
                  className="w-6 h-6 p-0 border-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400" />
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
              Download XLSX
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {Array(cols).fill(null).map((_, i) => (
                    <th key={i} className="border p-2 bg-slate-50">
                      {String.fromCharCode(65 + i)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border p-0">
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          onFocus={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                          className={`w-full p-2 focus:bg-blue-50 outline-none text-${cell.format.align}`}
                          style={{
                            fontWeight: cell.format.bold ? 'bold' : 'normal',
                            fontStyle: cell.format.italic ? 'italic' : 'normal',
                            color: cell.format.color,
                            backgroundColor: cell.format.background
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}