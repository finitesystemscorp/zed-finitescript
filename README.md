# FiniteScript for Zed

This is a Zed dev extension for `.fin` FiniteScript files. It uses a
Tree-sitter grammar plus Zed query files for syntax highlighting, bracket
matching, indentation, and outline items.

## Install

1. Open Zed.
2. Run `zed: install dev extension` from the command palette.
3. Select `/Users/josh/Projects/zed-finitescript`.
4. Open a `.fin` file, such as `client/scripts/examples/extrude.fin`.

If Zed cannot load the extension, run `zed: open log`. This extension's grammar
entry points at the standalone GitHub repository:

```toml
repository = "https://github.com/finitesystemscorp/zed-finitescript"
rev = "main"
```

For local development, install this directory with `zed: install dev extension`. Zed will fetch the grammar from the repository configured in `extension.toml`.

## Development

```bash
cd /Users/josh/Projects/zed-finitescript
tree-sitter generate
tree-sitter test
tree-sitter parse -q test/corpus/basic.txt
```
