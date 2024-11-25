import { assertEquals } from '@std/assert';

import { partOne, partTwo } from './solution.ts';
import { partOneRefactored, partTwoRefactored } from './solution_refactored.ts';

const sampleInputData = await Deno.readTextFile(
	new URL('./input.txt', import.meta.url),
);

const inputData = await Deno.readTextFile(
	new URL('./input.txt', import.meta.url),
);

Deno.test('partOne should return 0', () => {
	assertEquals(partOne(sampleInputData), 0);
});

Deno.test('partTwo should return 0', () => {
	assertEquals(partTwo(sampleInputData), 0);
});

Deno.test('partOne refactored should return 0', () => {
	assertEquals(partOneRefactored(inputData), 0);
});

Deno.test('partTwo refactored should return 0', () => {
	assertEquals(partTwoRefactored(inputData), 0);
});
