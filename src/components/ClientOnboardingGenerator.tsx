import React, { useState } from 'react';
import { ClipboardCheck, Copy, Download, Plus, X } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export default function ClientOnboardingGenerator() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Contract Sent', checked: false },
    { id: '2', text: 'Contract Signed', checked: false },
    { id: '3', text: 'Deposit Received', checked: false },
    { id: '4', text: 'Project Brief Confirmed', checked: false },
    { id: '5', text: 'Access Granted to Systems', checked: false },
    { id: '6', text: 'Kick-off Call Scheduled', checked: false },
    { id: '7', text: 'Welcome Email Sent', checked: false },
    { id: '8', text: 'Project Timeline Approved', checked: false }
  ]);

  const [newItem, setNewItem] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addCustomItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now().toString(),
        text: newItem.trim(),
        checked: false
      }]);
      setNewItem('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const copyToClipboard = () => {
    const text = items
      .map(item => `${item.checked ? '✓' : '☐'} ${item.text}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadChecklist = () => {
    const text = items
      .map(item => `${item.checked ? '✓' : '☐'} ${item.text}`)
      .join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'onboarding-checklist.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Client Onboarding Checklist" 
          description="Generate professional onboarding checklists"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add custom item..."
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
              />
              <button
                onClick={addCustomItem}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="flex-1">{item.text}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Generated Checklist
              </h2>
              
              <div className="space-y-2 font-mono text-sm mb-6">
                {items.map(item => (
                  <div key={item.id}>
                    {item.checked ? '✓' : '☐'} {item.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadChecklist}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  Customize the checklist for each client type
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  Add project-specific items as needed
                </li>
                <li className="flex items-center gap-2 text-blue-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  Review and update regularly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}