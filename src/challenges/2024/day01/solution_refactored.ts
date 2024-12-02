import { readAdjacentFile } from '@/utils/file.ts';

if (import.meta.main) {
	// const textInput = await readAdjacentFile(import.meta.url, './input.txt');
	//
	// const result = partOne(textInput);
	// const result2 = partTwo(textInput);
	//
	// console.log('Part one:', result);
	// console.log('Part two:', result2);
}

export function partOneRefactored(input: string): number {
	const pairs = input
		.trim()
		.split('\n')
		.map((line) => line.trim().split(/\s+/).map(Number));

	const [leftList, rightList] = pairs.reduce<[number[], number[]]>(
		([left, right], [val1, val2]) => {
			left.push(val1);
			right.push(val2);
			return [left, right];
		},
		[[], []],
	);

	leftList.sort((a, b) => a - b);
	rightList.sort((a, b) => a - b);

	let totalDistance = 0;
	for (let i = 0; i < leftList.length; i++) {
		totalDistance += Math.abs(leftList[i] - rightList[i]);
	}

	return totalDistance;
}
export function partTwoRefactored(input: string): number {
	const pairs = input
		.trim()
		.split('\n')
		.map((line) => line.trim().split(/\s+/).map(Number));

	const leftCol = pairs.map((row) => row[0]);
	const rightCol = pairs.map((row) => row[1]);

	const rightFrequency = new Map<number, number>();
	for (let i = 0; i < rightCol.length; i++) {
		const num = rightCol[i];
		rightFrequency.set(num, (rightFrequency.get(num) || 0) + 1);
	}

	let total = 0;
	for (let i = 0; i < leftCol.length; i++) {
		const num = leftCol[i];
		const count = rightFrequency.get(num) || 0;
		total += num * count;
	}

	return total;
}
