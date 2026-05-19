# FiniteScript for Zed

This is a repo-local Zed dev extension for `.fin` FiniteScript files. It uses a
Tree-sitter grammar plus Zed query files for syntax highlighting, bracket
matching, indentation, and outline items.

## Install

1. Open Zed.
2. Run `zed: install dev extension` from the command palette.
3. Select `tools/zed-finitescript` from this repository.
4. Open a `.fin` file, such as `client/scripts/examples/extrude.fin`.

If Zed cannot load the extension, run `zed: open log`. This extension's grammar
entry points at the local Git repo for this checkout:

```toml
repository = "file:///Users/josh/Projects/datum2/tools/zed-finitescript"
rev = "HEAD"
```

If the repository moves, update that path in `extension.toml`.

## Development

```bash
cd tools/zed-finitescript
tree-sitter generate
tree-sitter test
tree-sitter parse -q ../../client/scripts/examples/*.fin
```
