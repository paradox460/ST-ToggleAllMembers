# Toggle All Members

A [SillyTavern](https://github.com/SillyTavern/SillyTavern) extension that adds **Enable All** and **Disable All** buttons to the group chat members panel. One click toggles automatic replies for every member in the current group.

## Installation

1. In SillyTavern, open **Extensions** → **Install Extension**.
2. Paste the repository URL: `https://github.com/paradox460/ST-ToggleAllMembers`
3. SillyTavern will clone and load the extension automatically.

Alternatively, clone or symlink this repo into your SillyTavern extensions directory:

```
data/<user>/extensions/third-party/ST-ToggleAllMembers
```

## Usage

1. Open a **group chat**.
2. Open the group settings panel (click the group avatar/name).
3. Expand the **Current Members** drawer.
4. Two icon buttons appear at the top:
   - **Enable All** (speech bubble icon) — re-enables auto-replies for every member.
   - **Disable All** (muted speech bubble icon) — disables auto-replies for every member.

State persists across page refreshes — the extension writes directly to the group via the SillyTavern API.

## Development

### Prerequisites

- [Bun](https://bun.sh)
- [mise](https://mise.jdx.dev) (optional, manages tool versions)

### Build

```sh
bun install
mise run build        # produces dist/index.js + dist/index.css
```

### Lint & Type Check

```sh
mise run ci         # typescript check and eslint
```

## Project Structure

```
src/
  index.ts          Extension entry point — toggle logic + DOM injection
  buttons.html      Button template (icon-only menu_buttons)
  style.css         Button bar layout
global.d.ts         SillyTavern global type imports
manifest.json       ST extension manifest
```

## License
Copyright 2026 Jeff Sandberg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
