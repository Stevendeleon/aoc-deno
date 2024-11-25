import { parseArgs } from '@std/cli';

import { CURRENT_YEAR, DEFAULT_INPUT_FILE } from '@cli/constants.ts';

import {
	createDirectories,
	fetchData,
	printHelpMessage,
	runBenchmarks,
	runClean,
	runSolution,
	runTests,
} from '@cli/functions.ts';
import { FetchDataParams } from '@cli/types.ts';

const args = parseArgs(Deno.args, {
	alias: {
		year: 'y',
		day: 'd',
		part: 'p',
		input: 'i',
		run: 'r',
		help: 'h',
		generate: 'g',
		question: 'q',
		test: 't',
		bench: 'b',
		clean: 'c',
		fetch: 'f',
		data: 'dt',
	},
	string: ['year', 'day', 'part', 'input'],
	boolean: [
		'run',
		'help',
		'generate',
		'test',
		'bench',
		'clean',
		'fetch',
		'data',
	],
	default: {
		year: CURRENT_YEAR,
		input: DEFAULT_INPUT_FILE,
	},
});

if (args.help) {
	printHelpMessage();
	Deno.exit(0);
}

(async function () {
	const {
		year,
		day,
		part,
		input,
		run,
		generate,
		test,
		bench,
		clean,
		fetch,
		data: shouldFetchData,
		question,
	} = args;

	switch (true) {
		case generate:
			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				Deno.exit(1);
			}

			try {
				await createDirectories(year);
				console.log(
					`Templates for year ${year} have been generated successfully.`,
				);
			} catch (e) {
				console.error(`Error creating templates: ${e}`);
				Deno.exit(1);
			}
			break;

		case test:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				console.log('ex: `deno task cli --test --year 2020 --day 1`');
				Deno.exit(1);
			}

			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				console.log('ex: `deno task cli --test --year 2020 --day 1`');
				Deno.exit(1);
			}

			await runTests(year, day);
			break;

		case bench:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				console.log('ex: `deno task cli --bench --year 2020 --day 1`');
				Deno.exit(1);
			}

			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				console.log('ex: `deno task cli --bench --year 2020 --day 1`');
				Deno.exit(1);
			}

			await runBenchmarks(year, day);
			break;

		case run:
			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				Deno.exit(1);
			}

			if (!part || (part !== '1' && part !== '2')) {
				console.error(
					'Error: Please specify part 1 or 2 using the -p or --part flag.',
				);
				Deno.exit(1);
			}

			await runSolution(year, day, part, input);
			break;

		case clean:
			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				Deno.exit(1);
			}

			await runClean(year, day);
			break;

		case fetch:
			if (!year || isNaN(Number(year))) {
				console.error(
					'Error: Please provide a valid year using the -y or --year flag.',
				);
				Deno.exit(1);
			}

			if (
				!day || isNaN(Number(day)) || Number(day) < 1 ||
				Number(day) > 25
			) {
				console.error(
					'Error: Please provide a valid day (1-25) using the -d or --day flag.',
				);
				Deno.exit(1);
			}

			if (!shouldFetchData && question === undefined) {
				console.error(
					'Error: Please specify either the --data flag or the --question flag.',
				);
				Deno.exit(1);
			}

			const params: FetchDataParams = {
				year,
				day,
				isQuestion: false,
			};

			if (shouldFetchData) {
				await fetchData(params);
				break;
			}

			if (question !== undefined) {
				const number = Number(question);

				if (number === 1 || number === 2) {
					params.isQuestion = true;
					params.questionNumber = number;

					await fetchData(params);
					break;
				}
				console.error(
					'Error: Please specify the question part as 1 or 2 using the --question flag.',
				);
				Deno.exit(1);
			}

			break;

		default:
			console.error(
				'Error: No command specified. Use --help for usage instructions.',
			);

			Deno.exit(1);
	}
})();
