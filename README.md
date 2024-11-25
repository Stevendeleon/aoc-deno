# Advent of Code - with Deno.js

## Requirements
- Deno 2
  - See their installation guide: [here](https://docs.deno.com/runtime/getting_started/installation/)

### Tasks (scripts)
To view the tasks run `deno task` in your terminal

This will list out all available tasks

## CLI

To use the CLI, you'll need to run the cli task:
```shell

deno task cli [command] [options]

```

To see options run the `--help` or `-h` option:
```shell
# running the help flag:
deno task cli --help

# or
deno task cli -h

# OUTPUT:
#
# 🎅🏻 Advent of Code CLI (for Deno) 🎅🏻
#
# Usage: deno task cli [commands] [options]
#
# Commands:
#   -g, --generate                Generates directories and files for the given year
#   -r, --run                     Execute the solution
#   -t, --test                    Run tests for the specified day
#   -b, --bench                   Run benchmarks for the specified day
#   -c, --clean                   Removes specified directory by <year> or <year> and <day>
#   -h, --help                    Show this help message
# 
# Options:
#   -y, --year    <year>          Specify the year (default: current year)
#   -d, --day     <day>           Specify the day of the challenge (1-25)
#   -p, --part    <part>          Specify the part of the challenge to run (1 or 2)
#   -i, --input   <filename>      Specify the input file to use (default: input.txt)
# 
# Generate:
#   $ deno task cli --generate --year 2020
#   $ deno task cli -g -y 2020
#
#   $ deno task cli --generate  # Targets current year
#   $ deno task cli -g          # Targets current year
# 
# Run:
#   $ deno task cli --run --year 2020 --day 1 --part 1
#   $ deno task cli --run --year 2020 --day 1 --part 1 --input input_sample.txt
#
#   $ deno task cli -r -y 2020 -d 1 -p 1 -i input_sample.txt
#   $ deno task cli -r -y 2020 -d 1 -p 1
#
# Test:
#   $ deno task cli --test --year 2020 --day 1
#   $ deno task cli -t -y 2020 -d 1
# 
# Bench:
#   $ deno task cli --bench --year 2020 --day 1
#   $ deno task cli -b -y 2020 -d 1
# 
# Clean:
#   $ deno task cli --clean --year 2020           # Cleans YEAR
#   $ deno task cli --clean --year 2020 --day 1   # Cleans YEAR/<DAY>
#
#   $ deno task cli -c -y 2020                    # Cleans YEAR
#   $ deno task cli -c -y 2020 -d 1               # Cleans YEAR/<DAY>
#
```
### Benchmark example:
```shell
# run
deno task cli --bench --year 2024 --day 1

# Output:
deno task cli --bench --year 2024 --day 1
Task cli deno run --allow-read --allow-write --allow-run ./cli.ts "--bench" "--year" "2024" "--day" "1"
Check ~/aoc/src/2024/day01/solution_bench.ts
    CPU | Apple M1
Runtime | Deno 2.1.1 (aarch64-apple-darwin)

~/aoc/src/2024/day01/solution_bench.ts

benchmark   time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------- ----------------------------- --------------------- --------------------------
partOne              4.4 ns   229,300,000 (  4.0 ns … 295.9 ns)   4.1 ns  12.4 ns  17.2 ns
```

## Tasks
To view all tasks run:
```shell
deno task
```

This will output a list of available tasks in your `deno.json` file.

Example:
```text
~/Desktop/Code/aoc git:[main]
$ deno task

# OUTPUTS
Available tasks:
- cli
    // Runs the CLI for AOC -- for more help run `deno task cli -h`
    deno run --allow-read --allow-write --allow-run ./cli.ts
- test
    // Runs test files within ./src
    deno test --allow-all ./src
- test:coverage
    // Runs coverage with tests
    deno test --allow-all ./src --coverage=cov
- test:run:coverage
    deno test --allow-all ./src --coverage=cov && deno task coverage
- coverage
    // Runs the coverage report to STDOUT
    deno coverage cov
- coverage:lcov
    // Generates an lcov report from the coverage data
    deno coverage cov --lcov > coverage.lcov
- coverage:html
    // Converts the lcov report into an HTML view
    -- IMPORTANT NOTE -- This may require having `lcov` installed locally on your machine
    genhtml coverage.lcov --output-directory cov_report
- coverage:html:full
    // Runs tests, generates both LCOV and HTML reports, and opens the HTML report in a browser
    deno task test:coverage && deno task coverage:lcov && deno task coverage:html && deno run --allow-run ./open_coverage_report.ts
- format
    deno fmt
- lint
    deno lint
```
