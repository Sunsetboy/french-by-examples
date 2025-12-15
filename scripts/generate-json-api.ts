import fs from 'fs';
import path from 'path';
import { getAllConnectors, getAllTests } from '../lib/data';

const outputDir = path.join(process.cwd(), 'public', 'api');

// Ensure output directories exist
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateConnectorsAPI() {
  console.log('Generating connectors API...');

  const connectors = getAllConnectors();
  const connectorsDir = path.join(outputDir, 'connectors');

  ensureDirectoryExists(connectorsDir);

  // Generate connectors list (metadata only)
  const connectorsList = connectors.map((connector) => ({
    id: connector.id,
    term: connector.term,
    translation: connector.translation,
    type: connector.type,
    cefrLevel: connector.cefrLevel,
    formality: connector.formality,
  }));

  fs.writeFileSync(
    path.join(outputDir, 'connectors.json'),
    JSON.stringify(connectorsList, null, 2)
  );
  console.log(`Generated connectors.json with ${connectorsList.length} connectors`);

  // Generate individual connector files
  connectors.forEach((connector) => {
    fs.writeFileSync(
      path.join(connectorsDir, `${connector.id}.json`),
      JSON.stringify(connector, null, 2)
    );
  });
  console.log(`Generated ${connectors.length} individual connector files`);
}

function generateTestsAPI() {
  console.log('Generating tests API...');

  const tests = getAllTests();
  const testsDir = path.join(outputDir, 'tests');

  ensureDirectoryExists(testsDir);

  // Generate tests list (metadata only)
  const testsList = tests.map((test) => ({
    id: test.id,
    title: test.title,
    description: test.description,
    cefrLevel: test.cefrLevel,
    types: test.types,
    questionCount: test.questions.length,
  }));

  fs.writeFileSync(
    path.join(outputDir, 'tests.json'),
    JSON.stringify(testsList, null, 2)
  );
  console.log(`Generated tests.json with ${testsList.length} tests`);

  // Generate individual test files
  tests.forEach((test) => {
    fs.writeFileSync(
      path.join(testsDir, `${test.id}.json`),
      JSON.stringify(test, null, 2)
    );
  });
  console.log(`Generated ${tests.length} individual test files`);
}

function generateMetadataAPI() {
  console.log('Generating metadata API...');

  const connectors = getAllConnectors();
  const tests = getAllTests();

  const metadata = {
    totalConnectors: connectors.length,
    totalTests: tests.length,
    cefrLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    connectorTypes: Array.from(new Set(connectors.flatMap((c) => c.type))),
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  console.log('Generated metadata.json');
}

// Main execution
try {
  console.log('Starting JSON API generation...\n');

  generateConnectorsAPI();
  generateTestsAPI();
  generateMetadataAPI();

  console.log('\n✅ JSON API generation completed successfully!');
} catch (error) {
  console.error('❌ Error generating JSON API:', error);
  process.exit(1);
}
