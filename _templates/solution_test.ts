import { assertEquals } from '@std/assert';

import { partOne, partTwo } from './solution.ts';

const mockData = ``;

Deno.test('partOne should return true', () => {
	assertEquals(partOne(mockData), 1);
});

Deno.test('partTwo should return true', () => {
	assertEquals(partTwo(mockData), 2);
});
