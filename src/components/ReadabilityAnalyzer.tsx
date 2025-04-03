import React, { useState, useEffect } from 'react';
import { BarChart, AlertCircle } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface ReadabilityScores {
  fleschKincaid: number;
  gunningFog: number;
  averageWordsPerSentence: number;
  complexWords: string[];
  passiveVoice: string[];
}

export default function ReadabilityAnalyzer() {
  const [text, setText] = useState('');
  const [scores, setScores] = useState<ReadabilityScores>({
    fleschKincaid: 0,
    gunningFog: 0,
    averageWordsPerSentence: 0,
    complexWords: [],
    passiveVoice: []
  });

  useEffect(() => {
    if (text) {
      analyzeText(text);
    }
  }, [text]);

  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const isComplexWord = (word: string): boolean => {
    return countSyllables(word) >= 3;
  };

  const detectPassiveVoice = (sentence: string): boolean => {
    const passivePattern = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/i;
    return passivePattern.test(sentence);
  };

  const analyzeText = (content: string) => {
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    const words = content.split(/\s+/).filter(word => word.length > 0);
    
    const totalSyllables = words.reduce((acc, word) => acc + countSyllables(word), 0);
    const complexWords = words.filter(isComplexWord);
    const passiveVoice = sentences.filter(detectPassiveVoice);
    
    const averageWordsPerSentence = words.length / sentences.length;
    
    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * (words.length / sentences.length) + 11.8 * (totalSyllables / words.length) - 15.59;
    
    // Gunning Fog Index
    const gunningFog = 0.4 * ((words.length / sentences.length) + 100 * (complexWords.length / words.length));

    setScores({
      fleschKincaid: Math.round(fleschKincaid * 10) / 10,
      gunningFog: Math.round(gunningFog * 10) / 10,
      averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
      complexWords,
      passiveVoice
    });
  };

  const getReadabilityLevel = (score: number): string => {
    if (score <= 6) return 'Very Easy';
    if (score <= 8) return 'Easy';
    if (score <= 10) return 'Fairly Easy';
    if (score <= 12) return 'Standard';
    if (score <= 14) return 'Fairly Difficult';
    if (score <= 16) return 'Difficult';
    return 'Very Difficult';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Readability Analyzer" 
          description="Improve your content clarity"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              className="input-field min-h-[300px]"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Readability Scores
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Flesch-Kincaid Grade Level</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {scores.fleschKincaid}
                    <span className="text-sm font-normal ml-2">
                      ({getReadabilityLevel(scores.fleschKincaid)})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Gunning Fog Index</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {scores.gunningFog}
                    <span className="text-sm font-normal ml-2">
                      ({getReadabilityLevel(scores.gunningFog)})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-blue-700 mb-1">Average Words per Sentence</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {scores.averageWordsPerSentence}
                  </div>
                </div>
              </div>
            </div>

            {text && (scores.complexWords.length > 0 || scores.passiveVoice.length > 0) && (
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Suggestions
                </h3>
                
                {scores.complexWords.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-amber-800 mb-2">
                      Complex Words ({scores.complexWords.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {scores.complexWords.map((word, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {scores.passiveVoice.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-amber-800 mb-2">
                      Passive Voice Detected ({scores.passiveVoice.length})
                    </div>
                    <div className="space-y-2">
                      {scores.passiveVoice.map((sentence, index) => (
                        <div
                          key={index}
                          className="p-2 bg-amber-100 text-amber-800 rounded text-sm"
                        >
                          {sentence}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}