import React, { useState } from 'react';
import { Share2, Mail, Twitter, Linkedin, Facebook } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  imageFile?: File;
}

export default function ShareButtons({ title, description, url = window.location.href, imageFile }: ShareButtonsProps) {
  const [shareError, setShareError] = useState<string | null>(null);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    setShareError(null);

    try {
      // If we have an image file and the browser supports native sharing
      if (imageFile && navigator.share) {
        try {
          // Check if we can share with files first
          const shareData: ShareData = {
            title,
            text: description || title,
            url
          };

          // Only add files if the browser supports it
          if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
            shareData.files = [imageFile];
          }

          await navigator.share(shareData);
          return;
        } catch (error: any) {
          // Check specifically for permission errors
          if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
            setShareError('Share permission denied. Please enable share permissions in your browser settings.');
          } else {
            console.error('Native share failed:', error);
          }
          // Continue to fallback sharing methods
        }
      }

      // Traditional sharing fallback
      if (platform === 'email') {
        // For email, create a temporary link to download the image
        if (imageFile) {
          const imageUrl = URL.createObjectURL(imageFile);
          window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0ADownload image: ${imageUrl}`;
          setTimeout(() => URL.revokeObjectURL(imageUrl), 60000); // Clean up after 1 minute
        } else {
          window.location.href = shareLinks[platform];
        }
      } else {
        // For social platforms, open in a new window
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
      }
    } catch (error) {
      console.error('Share error:', error);
      setShareError('Unable to share. Please try another sharing method below.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {shareError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md mb-2">
          {shareError}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500 flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          Share:
        </span>
        <button
          onClick={() => handleShare('email')}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Share via Email"
        >
          <Mail className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on X (Twitter)"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}