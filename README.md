# runrc

Configurable per-directory command aliases and scripts

## Installation

```sh
deno install -A -n run -f https://deno.land/x/runrc/src/main.ts
```

## Example .runrc

```yaml
commands:
  - name: Say Hello
    alias: say-hello
    run: |
      echo "What is your name?"
      read INPUT_NAME
      echo "Hello $INPUT_NAME!"
```

## Usage

In a directory with a `.runrc` file in it:

```sh
run <alias> <...args>
```

## Templating

You can use the following templating expressions:

 - `{#}` - number of arguments
 - `{1}` - first argument
 - `{-1}` - last argument
 - `{..}` - all arguments
 - `{1..}` - all arguments after the first
 - `{..2}` - all arguments up to the second
 - `{1..3}` - arguments 2 to 4
