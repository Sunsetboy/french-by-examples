import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Connector, ConnectorMetadata } from '@/types/connector';
import { Test } from '@/types/test';

const connectorsDirectory = path.join(process.cwd(), 'data/connectors');
const testsDirectory = path.join(process.cwd(), 'data/tests');

export function getAllConnectorIds(): string[] {
  const fileNames = fs.readdirSync(connectorsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
    .map(fileName => fileName.replace(/\.(yaml|yml)$/, ''));
}

export function getConnectorById(id: string): Connector {
  const fullPath = path.join(connectorsDirectory, `${id}.yaml`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const data = yaml.load(fileContents) as Connector;

  return {
    ...data,
    id,
  };
}

export function getAllConnectors(): Connector[] {
  const ids = getAllConnectorIds();
  return ids.map(id => getConnectorById(id)).sort((a, b) => a.term.localeCompare(b.term));
}

export function getConnectorsByType(type: string): Connector[] {
  const allConnectors = getAllConnectors();
  return allConnectors.filter(connector => connector.type.includes(type as any));
}

export function getConnectorsByCEFR(level: string): Connector[] {
  const allConnectors = getAllConnectors();
  return allConnectors.filter(connector => connector.cefrLevel === level);
}

export function getAllConnectorMetadata(): ConnectorMetadata[] {
  return getAllConnectors().map(connector => ({
    id: connector.id,
    term: connector.term,
    translation: connector.translation,
    type: connector.type,
    cefrLevel: connector.cefrLevel,
    formality: connector.formality,
  }));
}

// Test functions
export function getAllTestIds(): string[] {
  if (!fs.existsSync(testsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(testsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
    .map(fileName => fileName.replace(/\.(yaml|yml)$/, ''));
}

export function getTestById(id: string): Test {
  const fullPath = path.join(testsDirectory, `${id}.yaml`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const data = yaml.load(fileContents) as Test;

  return {
    ...data,
    id,
  };
}

export function getAllTests(): Test[] {
  const ids = getAllTestIds();
  return ids.map(id => getTestById(id));
}
