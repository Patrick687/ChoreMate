import { fileURLToPath } from 'url';
import path from 'path';

it('should resolve import.meta.url', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    expect(typeof __filename).toBe('string');
    expect(typeof __dirname).toBe('string');
});