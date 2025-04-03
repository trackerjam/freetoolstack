import React, { useState, useRef, useEffect } from 'react';
import { Square, Circle, ArrowRight, Download, Trash2, Palette, Info, X, Share2 } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import * as Popover from '@radix-ui/react-popover';
import ToolHeader from './ToolHeader';
import ShareButtons from './ShareButtons';
import html2canvas from 'html2canvas';

interface Shape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  color: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPoint: { x: number; y: number };
  toPoint: { x: number; y: number };
}

interface Point {
  x: number;
  y: number;
}

export default function FlowchartTool() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [tempConnection, setTempConnection] = useState<{ from: Point; to: Point } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGuide, setShowGuide] = useState(true);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const addShape = (type: 'rectangle' | 'circle') => {
    const newShape: Shape = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      text: 'New Shape',
      width: 100,
      height: type === 'circle' ? 50 : 50,
      color: '#3B82F6'
    };
    setShapes([...shapes, newShape]);
  };

  const getConnectionPoints = (shape: Shape): Point[] => {
    const points: Point[] = [];
    const { x, y, width, height } = shape;
    
    points.push({ x: x, y: y + height / 2 });
    points.push({ x: x + width, y: y + height / 2 });
    points.push({ x: x + width / 2, y: y });
    points.push({ x: x + width / 2, y: y + height });
    
    return points;
  };

  const findNearestPoint = (point: Point, shape: Shape): Point => {
    const points = getConnectionPoints(shape);
    return points.reduce((nearest, current) => {
      const currentDist = Math.hypot(point.x - current.x, point.y - current.y);
      const nearestDist = Math.hypot(point.x - nearest.x, point.y - nearest.y);
      return currentDist < nearestDist ? current : nearest;
    });
  };

  const handleMouseDown = (e: React.MouseEvent, shapeId: string) => {
    if (connecting) {
      if (connecting !== shapeId) {
        const fromShape = shapes.find(s => s.id === connecting);
        const toShape = shapes.find(s => s.id === shapeId);
        
        if (fromShape && toShape) {
          const fromPoint = findNearestPoint(
            { x: e.clientX - canvasRef.current!.getBoundingClientRect().left, y: e.clientY - canvasRef.current!.getBoundingClientRect().top },
            fromShape
          );
          const toPoint = findNearestPoint(
            { x: e.clientX - canvasRef.current!.getBoundingClientRect().left, y: e.clientY - canvasRef.current!.getBoundingClientRect().top },
            toShape
          );

          setConnections([
            ...connections,
            {
              id: Date.now().toString(),
              from: connecting,
              to: shapeId,
              fromPoint,
              toPoint
            }
          ]);
        }
      }
      setConnecting(null);
      setTempConnection(null);
    } else {
      const shape = shapes.find(s => s.id === shapeId);
      if (shape) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setDragging(shapeId);
      }
    }
    setSelectedShape(shapeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && canvasRef.current) {
      const shape = shapes.find(s => s.id === dragging);
      if (shape) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;
        
        const updatedShape = { ...shape, x, y };
        setShapes(shapes.map(s => s.id === dragging ? updatedShape : s));
        
        setConnections(connections.map(conn => {
          if (conn.from === dragging || conn.to === dragging) {
            const fromShape = conn.from === dragging ? updatedShape : shapes.find(s => s.id === conn.from)!;
            const toShape = conn.to === dragging ? updatedShape : shapes.find(s => s.id === conn.to)!;
            
            return {
              ...conn,
              fromPoint: findNearestPoint(conn.toPoint, fromShape),
              toPoint: findNearestPoint(conn.fromPoint, toShape)
            };
          }
          return conn;
        }));
      }
    } else if (connecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const fromShape = shapes.find(s => s.id === connecting);
      
      if (fromShape) {
        const mousePoint = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        const fromPoint = findNearestPoint(mousePoint, fromShape);
        
        setTempConnection({
          from: fromPoint,
          to: mousePoint
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const startConnecting = (shapeId: string) => {
    setConnecting(shapeId);
  };

  const updateShapeText = (id: string, text: string) => {
    setShapes(shapes.map(shape =>
      shape.id === id ? { ...shape, text } : shape
    ));
  };

  const deleteShape = (id: string) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    setConnections(connections.filter(conn =>
      conn.from !== id && conn.to !== id
    ));
  };

  const updateShapeColor = (id: string, color: string) => {
    setShapes(shapes.map(shape =>
      shape.id === id ? { ...shape, color } : shape
    ));
  };

  const renderArrowMarker = () => (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3.5, 0 7"
          fill="#4B5563"
        />
      </marker>
    </defs>
  );

  const shareFlowchart = async () => {
    if (!canvasRef.current) return;
    setShareError(null);

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        try {
          const file = new File([blob], 'flowchart.png', { type: 'image/png' });
          setImageFile(file);
          setShowShareOptions(true);

        } catch (error) {
          console.error('Error sharing flowchart:', error);
          setShareError('Unable to share. Please try another sharing option.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error creating flowchart image:', error);
      setShareError('Error creating flowchart image');
    }
  };

  const downloadFlowchart = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flowchart.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error creating flowchart image:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Flowchart Tool" 
          description="Design flowcharts and diagrams easily"
        />

        {showGuide && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>1. Add shapes using the buttons below</li>
                    <li>2. Click and drag shapes to position them</li>
                    <li>3. Click the arrow button on a shape to connect it to another shape</li>
                    <li>4. Use the color picker to customize shape colors</li>
                    <li>5. Double-click shape text to edit it</li>
                    <li>6. Share your flowchart using the share button</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => addShape('rectangle')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Square className="w-4 h-4 mr-2" />
            Add Rectangle
          </button>
          <button
            onClick={() => addShape('circle')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Circle className="w-4 h-4 mr-2" />
            Add Circle
          </button>
          <button
            onClick={shareFlowchart}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Flowchart
          </button>
          <button
            onClick={downloadFlowchart}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </button>
        </div>

        {shareError && (
          <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
            {shareError}
          </div>
        )}

        {showShareOptions && imageFile && (
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">Share Flowchart</h3>
              <button
                onClick={() => {
                  setShowShareOptions(false);
                  setImageFile(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ShareButtons
              title="Check out my flowchart!"
              description="Created with FreeToolStack's Flowchart Tool"
              imageFile={imageFile}
            />
          </div>
        )}

        <div
          ref={canvasRef}
          className="relative bg-gray-50 border border-gray-200 rounded-lg"
          style={{ height: '600px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {renderArrowMarker()}
            {connections.map(conn => (
              <line
                key={conn.id}
                x1={conn.fromPoint.x}
                y1={conn.fromPoint.y}
                x2={conn.toPoint.x}
                y2={conn.toPoint.y}
                stroke="#4B5563"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            ))}
            {tempConnection && (
              <line
                x1={tempConnection.from.x}
                y1={tempConnection.from.y}
                x2={tempConnection.to.x}
                y2={tempConnection.to.y}
                stroke="#4B5563"
                strokeWidth="2"
                strokeDasharray="4"
                markerEnd="url(#arrowhead)"
              />
            )}
          </svg>

          {shapes.map(shape => (
            <div
              key={shape.id}
              className={`absolute cursor-move ${
                selectedShape === shape.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                left: shape.x,
                top: shape.y,
                width: shape.width,
                height: shape.height,
                zIndex: 1
              }}
              onMouseDown={(e) => handleMouseDown(e, shape.id)}
            >
              <div
                className={`w-full h-full flex items-center justify-center text-white ${
                  shape.type === 'rectangle'
                    ? 'rounded-md'
                    : 'rounded-full'
                }`}
                style={{ backgroundColor: shape.color }}
              >
                <input
                  type="text"
                  value={shape.text}
                  onChange={(e) => updateShapeText(shape.id, e.target.value)}
                  className="bg-transparent text-center w-full outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {selectedShape === shape.id && (
                <div className="absolute -top-8 left-0 flex gap-2">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Palette className="w-4 h-4" />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="bg-white rounded-lg shadow-xl p-2"
                        sideOffset={5}
                      >
                        <HexColorPicker
                          color={shape.color}
                          onChange={(color) => updateShapeColor(shape.id, color)}
                        />
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <button
                    onClick={() => startConnecting(shape.id)}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteShape(shape.id)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {getConnectionPoints(shape).map((point, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-blue-600 rounded-full"
                  style={{
                    left: point.x - shape.x - 4,
                    top: point.y - shape.y - 4,
                    display: selectedShape === shape.id ? 'block' : 'none'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}