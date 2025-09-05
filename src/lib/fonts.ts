// This is a workaround for the html-to-image library to embed fonts from Google Fonts.
// See: https://github.com/bubkoo/html-to-image/issues/336

async function getFontCss(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font CSS from ${url}: ${response.statusText}`);
    }
    return response.text();
  }
  
  async function getFontBlob(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font blob from ${url}: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  export async function getFontEmbedCSS(): Promise<string> {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    const fontCssText = await getFontCss(fontUrl);
  
    const fontResources = fontCssText.match(/src: url\((.+?)\)/g);
    if (!fontResources) {
      return fontCssText;
    }
  
    let embeddedCss = fontCssText;
    for (const resource of fontResources) {
      const url = resource.replace(/src: url\((.+?)\)/g, '$1');
      const dataUrl = await getFontBlob(url);
      embeddedCss = embeddedCss.replace(resource, `src: url(${dataUrl})`);
    }
  
    return embeddedCss;
  }
  