#!/usr/bin/env node
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const urls = [
  'https://www.pubnub.com/docs/chat/chat-sdk/build/sample-chat ',
];

async function fetchArticle(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const html = await response.text();
  const dom = new JSDOM(html);
  const { document } = dom.window;
  document.querySelectorAll('script, style').forEach(el => el.remove());
  const article = document.querySelector('article');
  if (!article) {
    throw new Error(`No <article> element found in ${url}`);
  }
  const turndownService = new TurndownService();
  return turndownService.turndown(article);
}

async function main() {
  console.log('Fetching PubNub Metadata articles...');
  const contents = [];
  for (const url of urls) {
    console.log(`Processing ${url}`);
    try {
      const markdown = await fetchArticle(url);
      contents.push(markdown);
    } catch (err) {
      console.error(err);
    }
  }

  const output = contents.join('\n\n');
  const resourcesDir = join(__dirname, 'resources');
  const languagesDir = join(resourcesDir, 'languages');
  const outputPath = join(resourcesDir, 'pubnub_chat_sdk.md');
  const outputPathLang = join(languagesDir, 'chat_sdk.md');
  fs.writeFileSync(outputPath, output, 'utf8');
  fs.writeFileSync(outputPathLang, output, 'utf8');
  console.log(`Saved concatenated markdown to ${outputPath}`);
  console.log(`Saved concatenated markdown to ${outputPathLang}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
