import { assertEquals } from '@std/assert';

import { partOne, partTwo } from './solution.ts';
import { partOneRefactored, partTwoRefactored } from './solution_refactored.ts';

const sampleInputData = await Deno.readTextFile(
	new URL('./input_sample.txt', import.meta.url),
);

Deno.test('partOne should return 11', () => {
	assertEquals(partOne(sampleInputData), 11);
});

Deno.test('partTwo should return 31', () => {
	assertEquals(partTwo(sampleInputData), 31);
});

Deno.test('partOne refactored should return 11', () => {
	assertEquals(partOneRefactored(sampleInputData), 11);
});

Deno.test('partTwo refactored should return 31', () => {
	assertEquals(partTwoRefactored(sampleInputData), 31);
});
