import React from 'react';
import ShareButtons from './ShareButtons';
import { Bookmark } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description?: string;
}

export default function ToolHeader({ title, description }: ToolHeaderProps) {
  const handleBookmark = () => {
    if (typeof window === 'undefined') return;

    // Use the browser's built-in bookmark command
    if (navigator.userAgent.includes('Mac')) {
      alert('Press ⌘+D to bookmark this page');
    } else {
      alert('Press Ctrl+D to bookmark this page');
    }
  };

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-slate-600 mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleBookmark}
          className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="Bookmark this page"
        >
          <Bookmark className="w-5 h-5" />
        </button>
        <ShareButtons title={title} description={description} />
      </div>
    </div>
  );
}