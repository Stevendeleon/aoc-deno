# Advent of Code - with Deno.js

## Requirements
- Deno 2
  - See their installation guide: [here](https://docs.deno.com/runtime/getting_started/installation/)

## CLI

To use the CLI, you'll need to run the cli task:
```shell

deno task cli [options]

```

To see options run the `--help` or `-h` option:
```shell
# running the help flag:
deno task cli --help

# or
deno task cli -h
```

To scaffold and stub out your solutions for a given year:
```shell
# template challenges for given year
deno task cli --template --year <target-year> 
```

To run a solution for a given challenge:

> Note - input.txt is the default if you do not pass one it, it will target that
```shell
# run
deno task cli --run --year 2020 --day 1 --part 1 --input input.txt

# or
deno task cli -r -y 2020 -d 1 -p 1
```

To test as solution:
```shell
# run
deno task cli --test --year 2020 --day 1

# or
deno task cli --t --y 2020 --d 1
```

To benchmark a solution:
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