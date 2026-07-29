import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { OllamaProvider } from '../providers/OllamaProvider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

console.log('--- OLLAMA PROVIDER STANDALONE TEST ---');
console.log('OLLAMA_BASE_URL =', process.env.OLLAMA_BASE_URL);
console.log('OLLAMA_MODEL =', process.env.OLLAMA_MODEL);

async function testOllama() {
  const provider = new OllamaProvider();
  
  console.log('\nChecking health...');
  const isHealthy = await provider.isHealthy();
  console.log('Is Healthy:', isHealthy);

  if (!isHealthy) {
    console.error('Health check failed! Exiting test.');
    process.exit(1);
  }

  console.log('\nSending test prompt: "Hello" to Ollama...');
  try {
    const response = await provider.generateText('Hello');
    console.log('\n[SUCCESS] Ollama Response Received:\n', response);
  } catch (err) {
    console.error('\n[FAILURE] Ollama call failed:', err.message);
  }
}

testOllama();
