# RunRC

Configurable per-directory command aliases and scripts.

## Installation

### Deno

```sh
deno install -A -n runrc -f https://deno.land/x/runrc/src/main.ts
```

### NPM

```sh
npm install -g runrc
```

## Usage

RunRC allows the configuration of custom, parameterised commands, per directory.
To get started, run:

```sh
runrc init
```

This will create a `.runrc` file in the current working directory. This will
contain an example configuration, which you can edit as needed.

The example configuration generated by `init` contains a `hello` command. You
can run it like this:

```sh
runrc hello World
```

```
Hello World!
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
