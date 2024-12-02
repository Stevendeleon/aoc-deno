import { assertEquals } from '@std/assert';

import { partOne, partTwo } from './solution.ts';
import { partOneRefactored, partTwoRefactored } from './solution_refactored.ts';

const sampleInputData = await Deno.readTextFile(
	new URL('./input_sample.txt', import.meta.url),
);

Deno.test('partOne should return 2', () => {
	assertEquals(partOne(sampleInputData), 2);
});

Deno.test('partTwo should return 4', () => {
	assertEquals(partTwo(sampleInputData), 4);
});

Deno.test('partOne refactored should return 0', () => {
	assertEquals(partOneRefactored(sampleInputData), 0);
});

Deno.test('partTwo refactored should return 0', () => {
	assertEquals(partTwoRefactored(sampleInputData), 0);
});
