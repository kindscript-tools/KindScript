import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadScript(slug) {
  const filePath = path.resolve('./src/content/scripts', `${slug}.yaml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);
  return data;
}
