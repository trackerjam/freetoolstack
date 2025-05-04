import React, { useState } from 'react';
import { Link as LinkIcon, Plus, Copy, X, ExternalLink } from 'lucide-react';
import ToolHeader from './ToolHeader';

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export default function LinkHubGenerator() {
  const [hubTitle, setHubTitle] = useState('');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const addLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setLinks([...links, {
        id: Date.now().toString(),
        title: newLink.title.trim(),
        url: newLink.url.trim()
      }]);
      setNewLink({ title: '', url: '' });
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const generateShareableUrl = () => {
    // In a real implementation, this would make an API call to create a shareable link
    const data = {
      title: hubTitle,
      links: links
    };
    
    // For demo purposes, we'll create a base64 encoded string
    const encodedData = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/hub/${encodedData}`;
    setShareUrl(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <ToolHeader 
          title="Project Link Hub Generator" 
          description="Create shareable project resource pages"
        />
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hub Title
            </label>
            <input
              type="text"
              value={hubTitle}
              onChange={(e) => setHubTitle(e.target.value)}
              placeholder="e.g., Project Phoenix Resources"
              className="input-field"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Title
                </label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="e.g., Project Plan"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://"
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={addLink}
              className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {links.map(link => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-slate-900">{link.title}</div>
                    <div className="text-sm text-slate-500">{link.url}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {links.length > 0 && (
            <div>
              <button
                onClick={generateShareableUrl}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mb-4"
              >
                Generate Shareable Link
              </button>

              {shareUrl && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 font-mono text-sm truncate">
                      {shareUrl}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={copyToClipboard}
                        className="text-slate-600 hover:text-blue-600"
                      >
                        {copied ? (
                          <span className="text-green-600 text-sm">Copied!</span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {links.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              Add links to create your hub
            </div>
          )}
        </div>
      </div>
    </div>
  );
}