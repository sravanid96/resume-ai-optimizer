/**
 * Copy content to clipboard with optional Word formatting
 */
export const copyToClipboard = async (
  element: HTMLElement | null,
  plainText: string,
  forWord: boolean = false
): Promise<boolean> => {
  // If no element, just copy plain text
  if (!element) {
    await navigator.clipboard.writeText(plainText);
    return true;
  }

  try {
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove tooltips
    const tooltips = clone.querySelectorAll('[data-tooltip="true"]');
    tooltips.forEach(t => t.remove());
    
    let htmlContent = clone.innerHTML;
    
    if (forWord) {
      htmlContent = `
        <html>
          <head>
            <meta charset='utf-8'>
            <style>
              body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.15; color: #000000; }
              h1 { font-size: 16pt; font-weight: bold; margin-bottom: 6pt; border-bottom: 1px solid #ddd; padding-bottom: 2pt; }
              h2 { font-size: 13pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
              p { margin-bottom: 6pt; }
              ul { margin-top: 0; margin-bottom: 6pt; padding-left: 20pt; }
              li { margin-bottom: 2pt; }
              strong { font-weight: bold; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;
    } else {
      htmlContent = `<html><body>${htmlContent}</body></html>`;
    }
    
    const textContent = clone.innerText;

    const blobHtml = new Blob([htmlContent], { type: 'text/html' });
    const blobText = new Blob([textContent], { type: 'text/plain' });

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      })
    ]);

    return true;
  } catch (err) {
    console.error('Rich copy failed:', err);
    // Fallback to plain text
    await navigator.clipboard.writeText(element.innerText);
    return true;
  }
};

