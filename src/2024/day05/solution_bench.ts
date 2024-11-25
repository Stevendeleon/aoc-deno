import { partOne, partTwo } from './solution.ts';
const testData = ``;

Deno.bench('partOne', () => {
	partOne(testData);
});

Deno.bench('partTwo', () => {
	partTwo(testData);
});
