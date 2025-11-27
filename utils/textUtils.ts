/**
 * Clean markdown text from AI response
 * - Converts literal \n to actual newlines
 * - Removes carriage returns
 * - Strips wrapping bold markers
 */
export const cleanMarkdownText = (text: string): string => {
  if (!text) return "";
  
  let cleaned = text.replace(/\\n/g, '\n');
  cleaned = cleaned.replace(/\\r/g, '');

  const trimmed = cleaned.trim();
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    cleaned = cleaned.replace(/^\*\*/, '').replace(/\*\*$/, '');
  }

  return cleaned;
};

/**
 * Escape special regex characters in a string
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Format timestamp to readable date string
 */
export const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown Date';
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

/**
 * Generate a URL-safe slug from a keyword
 */
export const keywordToSlug = (keyword: string): string => {
  return keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

