import { readAdjacentFile } from '@/utils/file.ts';

if (import.meta.main) {
	// const textInput = await readAdjacentFile(import.meta.url, './input_sample.txt');
	//
	// const result = partOne(textInput);
	// const result2 = partTwo(textInput);
	//
	// console.log('Part one:', result);
	// console.log('Part two:', result2);
}

export function partOne(input: string): number {
	const regex = /mul\(([\d.]+),([\d.]+)\)/g;
	const matches = input.match(regex);

	let sum = 0;
	const formattedMatches = matches?.map(match => {
		const matchResult = match.match(/\((\d+),(\d+)\)/);
		if (matchResult) {
			const [, x, y] = matchResult;
			return `${x},${y}`;
		}
		return null;
	}).filter(Boolean)

	for (let i = 0; i < formattedMatches!.length; i++) {
		const [x, y] = formattedMatches![i]!.split(',');
		sum += Number(x) * Number(y);
	}

	return sum;
}
export function partTwo(input: string): number {
	const regex = /mul\(([\d.]+),([\d.]+)\)|do\(\)|don't\(\)/g;

	let inExclusionZone = false;
	let match;
	let sum = 0;
	const matches: string[] = [];

	while ((match = regex.exec(input)) !== null) {
		const [fullMatch, arg1, arg2] = match;

		if (fullMatch === "do()") {
			inExclusionZone = false;
		}

		if (fullMatch === "don't()") {
			inExclusionZone = true;
		}

		if (!inExclusionZone && arg1 !== undefined && arg2 !== undefined) {
			matches.push(`${arg1},${arg2}`);
		}
	}
	// console.log(matches);

	for (let i = 0; i < matches.length; i++) {
		const [x, y] = matches[i]!.split(',');
		sum += Number(x) * Number(y);

	}
	return sum;
}
