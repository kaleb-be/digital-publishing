export function injectWatermark(html: string, userId: string) {
  if (!html) return html;

  const marker = generateInvisibleMarker(userId);

  // Insert watermark inside paragraphs randomly
  return html.replace(/<\/p>/g, (match, index) => {
    if (Math.random() < 0.3) {
      return `<span style="opacity:0; font-size:0;">${marker}</span>${match}`;
    }
    return match;
  });
}

function generateInvisibleMarker(userId: string) {
  const timestamp = Date.now();

  // Encode user info
  const raw = `${userId}-${timestamp}`;

  return toZeroWidth(raw);
}

// Converts string to zero-width characters
function toZeroWidth(str: string) {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(8203 + (code % 5)); // zero-width chars
    })
    .join("");
}