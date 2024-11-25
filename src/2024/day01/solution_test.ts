import { assertEquals } from '@std/assert';

import { partOne, partTwo } from './solution.ts';

const mockData = ``;

Deno.test('partOne should return 0', () => {
	assertEquals(partOne(mockData), 1);
});

Deno.test('partTwo should return 0', () => {
	assertEquals(partTwo(mockData), 0);
});
