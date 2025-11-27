import { cleanMarkdownText, escapeRegex } from './textUtils';

/**
 * Highlight keywords in text by wrapping them in backticks for markdown
 */
export const highlightKeywords = (
  text: string, 
  keywords: string[]
): string => {
  let result = cleanMarkdownText(text);

  if (!keywords || keywords.length === 0) {
    return result;
  }

  const uniqueKeywords = Array.from(new Set(keywords));

  uniqueKeywords.forEach(keyword => {
    if (!keyword || keyword.length < 2) return;
    
    try {
      const escaped = escapeRegex(keyword);
      
      // Handle technical keywords like "C++", ".NET", "C#"
      const startsWithWord = /^\w/.test(keyword);
      const endsWithWord = /\w$/.test(keyword);
      
      const prefix = startsWithWord ? '\\b' : '';
      const suffix = endsWithWord ? '\\b' : '';
      
      const regex = new RegExp(`${prefix}(${escaped})${suffix}`, 'gi');
      result = result.replace(regex, '`$1`');
    } catch {
      // Ignore regex errors
    }
  });

  return result;
};

/**
 * Calculate keyword density (count occurrences in text)
 */
export const calculateKeywordDensity = (
  text: string, 
  keywords: string[]
): Array<[string, number]> => {
  if (!keywords || !text) return [];

  const counts: Record<string, number> = {};
  const uniqueKeywords = Array.from(new Set(keywords));
  const normalizedText = text.toLowerCase();

  uniqueKeywords.forEach(keyword => {
    if (!keyword) return;
    const escaped = escapeRegex(keyword);
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const match = normalizedText.match(regex);
    counts[keyword] = match ? match.length : 0;
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
};

/**
 * Extract context snippet for a keyword from job description
 */
export const getKeywordContext = (
  keyword: string, 
  jobDescription: string
): string => {
  if (!jobDescription || !keyword) {
    return "Key term from Job Description";
  }
  
  try {
    const escaped = escapeRegex(keyword);
    const regex = new RegExp(`([^.]*?${escaped}[^.]*\\.)`, 'i');
    const match = jobDescription.match(regex);
    
    if (match && match[1]) {
      let snippet = match[1].trim();
      if (snippet.length > 150) {
        const index = snippet.toLowerCase().indexOf(keyword.toLowerCase());
        const start = Math.max(0, index - 60);
        const end = Math.min(snippet.length, index + 60 + keyword.length);
        snippet = (start > 0 ? "..." : "") + 
                  snippet.substring(start, end) + 
                  (end < snippet.length ? "..." : "");
      }
      return snippet;
    }
  } catch {
    // Ignore errors
  }
  
  return "Significant keyword found in Job Description.";
};

