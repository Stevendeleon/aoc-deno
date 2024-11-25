import { partOne, partTwo } from './solution.ts';
import { partOneRefactored, partTwoRefactored } from './solution_refactored.ts';

const sampleInputData = await Deno.readTextFile(
	new URL('./input.txt', import.meta.url),
);

const inputData = await Deno.readTextFile(
	new URL('./input.txt', import.meta.url),
);

Deno.bench('partOne', () => {
	partOne(sampleInputData);
});

Deno.bench('partTwo', () => {
	partTwo(sampleInputData);
});

Deno.bench('partOne - Refactored', () => {
	partOneRefactored(inputData);
});

Deno.bench('partTwo - Refactored', () => {
	partTwoRefactored(inputData);
});
