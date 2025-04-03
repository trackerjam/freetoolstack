/// <reference types="vite/client" />

interface Window {
  chrome?: {
    bookmarks: {
      search: (query: { url?: string }) => Promise<{ id: string; url: string }[]>;
      create: (bookmark: { title: string; url: string }) => Promise<void>;
      remove: (id: string) => Promise<void>;
    };
  };
  sidebar?: {
    addPanel: (title: string, url: string, customizations: string) => void;
    removePanelTab: (url: string) => void;
  };
}