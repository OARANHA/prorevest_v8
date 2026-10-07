// Quick test script for /api/ai/upgrade-realista
// Uses a 1x1 PNG pixel as input and tests WEBP/JPEG/PNG outputs.

async function run() {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5177';
  const endpoint = `${baseUrl}/api/ai/upgrade-realista`;
  const sourceImage = process.env.TEST_IMAGE_URL || `${baseUrl}/images/mockup_produto.png`;

  async function test(format) {
    const texture = process.env.TEST_TEXTURE_URL || null;
    const meta = texture ? { textureUrl: texture, preserveOriginalImageStrict: true } : { width: 1, height: 1, sizeMB: 0.0001, type: 'image/png' };
    const body = {
      image: sourceImage,
      roi: { x0: 0.1, y0: 0.1, x1: 0.9, y1: 0.9 },
      color: '#F59E0B',
      blendMode: 'multiply',
      tintOpacity: 0.6,
      meta,
      outputFormat: format,
    };
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      const len = text.length;
      try {
        const json = JSON.parse(text);
        console.log(`${format} ->`, res.status, json.status, json.engine, !!json.processedImage, `jsonLen=${len}`);
      } catch {
        console.log(`${format} ->`, res.status, 'non-JSON', `len=${len}`);
      }
    } catch (e) {
      console.error(`${format} -> error:`, e.message);
    }
  }

  await test('webp');
  await test('jpeg');
  await test('png');
}

run();