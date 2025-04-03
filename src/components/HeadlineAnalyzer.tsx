import React, { useState, useEffect } from 'react';
import { BarChart, AlertCircle } from 'lucide-react';
import ToolHeader from './ToolHeader';

const POSITIVE_WORDS = ['best', 'amazing', 'awesome', 'incredible', 'perfect', 'excellent'];
const NEGATIVE_WORDS = ['worst', 'bad', 'terrible', 'horrible', 'poor', 'awful'];

export default function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState('');
  const [analysis, setAnalysis] = useState({
    length: 0,
    words: 0,
    sentiment: 'neutral',
    powerWords: 0,
    score: 0
  });

  useEffect(() => {
    analyzeHeadline(headline);
  }, [headline]);

  const analyzeHeadline = (text: string) => {
    const words = text.trim() ? text.toLowerCase().split(/\s+/) : [];
    const positiveCount = words.filter(word => POSITIVE_WORDS.includes(word)).length;
    const negativeCount = words.filter(word => NEGATIVE_WORDS.includes(word)).length;
    
    const sentiment = positiveCount > negativeCount ? 'positive' : 
                     negativeCount > positiveCount ? 'negative' : 'neutral';

    const score = Math.min(100, Math.max(0, 
      (text.length >= 20 && text.length <= 70 ? 30 : 0) +
      (words.length >= 5 && words.length <= 15 ? 30 : 0) +
      (positiveCount * 10) +
      (text.match(/[0-9]+/) ? 10 : 0) +
      (text.includes('?') || text.includes('!') ? 10 : 0)
    ));

    setAnalysis({
      length: text.length,
      words: words.length,
      sentiment,
      powerWords: positiveCount,
      score
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-container">
        <ToolHeader 
          title="Headline Analyzer" 
          description="Write better headlines that engage readers"
        />
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter your headline
            </label>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="input-field min-h-[120px]"
              placeholder="Type your headline here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-blue-500" />
                Length Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Characters</span>
                  <span className="font-mono text-lg font-medium text-slate-800">{analysis.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Words</span>
                  <span className="font-mono text-lg font-medium text-slate-800">{analysis.words}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Optimal Length</span>
                  {analysis.length >= 20 && analysis.length <= 70 ? (
                    <AlertCircle className="text-green-500 w-6 h-6" />
                  ) : (
                    <AlertCircle className="text-red-500 w-6 h-6" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sentiment</span>
                  <span className={`capitalize font-medium ${
                    analysis.sentiment === 'positive' ? 'text-green-600' :
                    analysis.sentiment === 'negative' ? 'text-red-600' :
                    'text-slate-600'
                  }`}>
                    {analysis.sentiment}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Power Words</span>
                  <span className="font-mono text-lg font-medium text-slate-800">{analysis.powerWords}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-slate-800">Overall Score</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">{analysis.score}</span>
                <span className="text-slate-400">/100</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${analysis.score}%` }}
              ></div>
            </div>
          </div>

          {headline && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Suggestions</h3>
              <ul className="space-y-3">
                {analysis.length < 20 && (
                  <li className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    Make your headline longer (aim for 20-70 characters)
                  </li>
                )}
                {analysis.length > 70 && (
                  <li className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    Your headline is too long (aim for 20-70 characters)
                  </li>
                )}
                {analysis.words < 5 && (
                  <li className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    Add more words (aim for 5-15 words)
                  </li>
                )}
                {analysis.powerWords === 0 && (
                  <li className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    Include power words to make your headline more engaging
                  </li>
                )}
                {!headline.match(/[0-9]+/) && (
                  <li className="flex items-center gap-2 text-blue-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                    Consider adding numbers to increase engagement
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}