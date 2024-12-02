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

export function partOne(input: string): number {
	let pairs = input.split("\n").map(line => line.trim().split(/\s+/).map(Number));

	const numCols = pairs[0].length;
	const transposed = Array.from({ length: numCols }, (_, i) =>
		pairs.map(row => row[i])
	);

	transposed.forEach(row => row.sort((a, b) => a - b));

	pairs = Array.from({ length: pairs.length }, (_, i) =>
		transposed.map(col => col[i])
	);

	console.table(pairs);

	let total = 0

	for (const pair of pairs) {
		total += Math.abs(pair[0] - pair[1])
	}

	return total;
}
export function partTwo(input: string): number {
	let pairs = input.split("\n").map(line => line.trim().split(/\s+/).map(Number));

	const numCols = pairs[0].length;
	const transposed = Array.from({ length: numCols }, (_, i) =>
		pairs.map(row => row[i])
	);

	transposed.forEach(row => row.sort((a, b) => a - b));

	pairs = Array.from({ length: pairs.length }, (_, i) =>
		transposed.map(col => col[i])
	);

	// console.table(pairs)

	let total = 0;
	const leftCol = pairs.map(row => row[0]);
	const rightCol = pairs.map(row => row[1]);

	for (let i = 0; i < leftCol.length; i++) {
		let counter = 0;
		for (let j = 0; j < rightCol.length; j++) {
			if (rightCol[j] === leftCol[i]) {
				counter++
			}
		}

		if (counter > 0) {
			// console.log(leftCol[i] * counter)
			const result = leftCol[i] * counter;
			total += result;
		}

		if (counter === 0) {
			// console.log('0 for', leftCol[i])
			total += 0
		}
	}

	return total;
}
