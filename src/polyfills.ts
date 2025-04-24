// Polyfills pour simuler un environnement Node.js dans le navigateur
(window as any).global = window;
(window as any).process = { env: { DEBUG: undefined } };
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
