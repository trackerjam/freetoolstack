import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface FormInputs {
  audience: string;
  problem: string;
  solution: string;
  benefit: string;
}

export default function StatementGenerator() {
  const [inputs, setInputs] = useState<FormInputs>({
    audience: '',
    problem: '',
    solution: '',
    benefit: ''
  });

  const [copied, setCopied] = useState<number | null>(null);

  const templates = [
    {
      id: 1,
      template: "For [audience] who struggle with [problem], [solution] provides [benefit].",
      style: "Professional"
    },
    {
      id: 2,
      template: "Stop wasting time on [problem]. [solution] helps you achieve [benefit].",
      style: "Direct"
    },
    {
      id: 3,
      template: "Are you a [audience] frustrated by [problem]? Discover how [solution] delivers [benefit].",
      style: "Question"
    },
    {
      id: 4,
      template: "Attention [audience]: Transform [problem] into [benefit] with [solution].",
      style: "Bold"
    },
    {
      id: 5,
      template: "Finally, a solution for [audience]: [solution] eliminates [problem] and ensures [benefit].",
      style: "Relief"
    }
  ];

  const generateStatement = (template: string) => {
    return template
      .replace('[audience]', inputs.audience || '[audience]')
      .replace('[problem]', inputs.problem || '[problem]')
      .replace('[solution]', inputs.solution || '[solution]')
      .replace('[benefit]', inputs.benefit || '[benefit]');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Problem/Solution Statement Generator" 
          description="Create compelling problem/solution statements"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                name="audience"
                value={inputs.audience}
                onChange={handleInputChange}
                placeholder="e.g., small business owners"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Problem
              </label>
              <input
                type="text"
                name="problem"
                value={inputs.problem}
                onChange={handleInputChange}
                placeholder="e.g., manual bookkeeping errors"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Solution/Product
              </label>
              <input
                type="text"
                name="solution"
                value={inputs.solution}
                onChange={handleInputChange}
                placeholder="e.g., BookKeep Pro"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Benefit
              </label>
              <input
                type="text"
                name="benefit"
                value={inputs.benefit}
                onChange={handleInputChange}
                placeholder="e.g., 99.9% accuracy and 75% time savings"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generated Statements
              </h2>
              
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <span className="text-sm font-medium text-blue-600">
                        {template.style} Style
                      </span>
                      <button
                        onClick={() => copyToClipboard(generateStatement(template.template), template.id)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        {copied === template.id ? (
                          <span className="text-green-600 text-sm">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-slate-700">
                      {generateStatement(template.template)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setInputs({ audience: '', problem: '', solution: '', benefit: '' })}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}