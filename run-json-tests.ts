import { TestRunner } from './test-runner';

async function main() {
  const testDataPath = './test-data/test-scenarios.json';
  const runner = new TestRunner(testDataPath);
  await runner.runAllTests();
}

main().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});

