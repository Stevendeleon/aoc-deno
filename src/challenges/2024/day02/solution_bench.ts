import { partOne, partTwo } from './solution.ts';
import { partOneRefactored, partTwoRefactored } from './solution_refactored.ts';

const inputData = await Deno.readTextFile(
	new URL('./input.txt', import.meta.url),
);

Deno.bench('partOne', () => {
	partOne(inputData);
});

Deno.bench('partTwo', () => {
	partTwo(inputData);
});

Deno.bench('partOne - Refactored', () => {
	partOneRefactored(inputData);
});

// Deno.bench('partTwo - Refactored', () => {
// 	partTwoRefactored(inputData);
// });
