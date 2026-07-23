import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Contributing" }

export default function Contributing() {
  return (
    <Prose>
      <H1>Contributing to fetchit</H1>
      <P>
        Thank you for considering contributing to fetchit. This guide covers everything you need
        to know — from setting up your development environment to shipping a release. Whether you
        are fixing a bug, adding a feature, improving documentation, or packaging for a new
        platform, you will find the relevant information here.
      </P>
      <Blockquote>
        fetchit is MIT-licensed and maintained by <Link href="https://github.com/Vedant1521">Vedant Gupta</Link>.
        The source code is available at{" "}
        <Link href="https://github.com/Vedant1521/fetchit">github.com/Vedant1521/fetchit</Link>.
        All contributions — code, docs, tests, bug reports — are welcome.
      </Blockquote>

      <H2>Prerequisites</H2>
      <P>Before you start contributing, make sure your environment meets these requirements:</P>
      <Ul>
        <Li><strong>Node.js 18 or later</strong> — fetchit targets Node.js 18+. Verify with <Code>node --version</Code>. We recommend the latest LTS release.</Li>
        <Li><strong>npm</strong> — ships with Node.js. Used for dependency management and running scripts.</Li>
        <Li><strong>Git</strong> — for version control, forking, and branching.</Li>
        <Li><strong>Bun</strong> (optional) — required only if you need to build standalone binaries via <Code>scripts/build-binary.js</Code>. Install with <Code>curl -fsSL https://bun.sh/install | bash</Code> or <Code>powershell -c "irm bun.sh/install.ps1 | iex"</Code>.</Li>
        <Li><strong>yt-dlp</strong> (optional) — fetchit bundles its own yt-dlp binary on first run. If you already have yt-dlp installed system-wide, it will use yours.</Li>
      </Ul>
      <Note>
        On Windows, you may need <Code>windows-build-tools</Code> for native module compilation. Install it with <Code>npm install --global windows-build-tools</Code>. On macOS, install Xcode Command Line Tools via <Code>xcode-select --install</Code>.
      </Note>

      <H2>Setup</H2>
      <P>Follow these steps to get the project running on your local machine.</P>
      <H3>1. Fork and clone the repository</H3>
      <P>
        Fork the repository on GitHub, then clone your fork:
      </P>
      <Pre>{`git clone https://github.com/YOUR_USERNAME/fetchit.git
cd fetchit`}</Pre>
      <P>
        Add the original repository as an upstream remote to sync changes later:
      </P>
      <Pre>{`git remote add upstream https://github.com/Vedant1521/fetchit.git`}</Pre>

      <H3>2. Install dependencies</H3>
      <Pre>{`npm install`}</Pre>
      <P>
        This installs all Node.js dependencies — Ink, React, tsup, TypeScript, and development
        tools. Native addons (if any) are compiled during this step. If you encounter build errors,
        ensure your C/C++ build toolchain is installed (see prerequisites above).
      </P>

      <H3>3. Verify the setup</H3>
      <P>Run the following commands to confirm everything works:</P>
      <Pre>{`npm run build
npm test
npm run typecheck`}</Pre>
      <P>
        All three should pass without errors. If <Code>npm test</Code> fails, make sure you are
        using Node.js 18+ and have all dependencies installed.
      </P>
      <P>
        Once the build succeeds, you can run fetchit locally:
      </P>
      <Pre>{`node dist/cli.js https://youtu.be/dQw4w9WgXcQ`}</Pre>
      <P>
        Or, if you want the <Code>fetchit</Code> command available globally during development:
      </P>
      <Pre>{`npm link
fetchit https://youtu.be/dQw4w9WgXcQ`}</Pre>

      <H3>Key technologies</H3>
      <P>fetchit is built on a modern, carefully chosen tech stack. Understanding these tools will help you navigate the codebase.</P>
      <Table
        headers={["Technology", "Purpose", "Learn more"]}
        rows={[
          ["TypeScript (strict)", "Application language — all source code is typed", "typescriptlang.org"],
          ["React 19", "UI runtime used by the terminal interface via Ink", "react.dev"],
          ["Ink 7", "React renderer for the terminal — lets you build TUI components with JSX", "github.com/vadimdemedes/ink"],
          ["tsup", "Bundler — compiles TypeScript to a single ESM bundle at dist/cli.js (~93 KB)", "tsup.etsy.com"],
          ["yt-dlp", "Download engine — probes URLs, extracts formats, performs downloads across 2,000+ sites", "github.com/yt-dlp/yt-dlp"],
          ["ffmpeg-static", "Bundled FFmpeg binary for merging streams and MP3 transcoding", "npmjs.com/package/ffmpeg-static"],
          ["Bun", "JavaScript runtime used to compile standalone binaries via build-binary.js", "bun.sh"],
          ["Node built-in test runner", "Testing via node:test and node:assert — no external test framework", "nodejs.org/api/test.html"],
        ]}
      />

      <H2>Development workflow</H2>
      <P>
        The development cycle is straightforward: make changes, let tsup rebuild, and test.
        Here are the commands you will use most often:
      </P>

      <Table
        headers={["Command", "What it does"]}
        rows={[
          ["npm run dev", "Watch mode — rebuilds dist/cli.js on every file change via tsup --watch"],
          ["npm run build", "Production build — bundles TypeScript into dist/cli.js with tsup"],
          ["npm test", "Runs all tests via tsx --test src/**/*.test.ts"],
          ["npm run typecheck", "TypeScript strict type-checking via tsc --noEmit"],
          ["npm run build:binary", "Builds a standalone binary via bun scripts/build-binary.js (requires Bun)"],
          ["node dist/cli.js <url>", "Runs fetchit locally after a build"],
        ]}
      />

      <H3>Watch mode</H3>
      <P>
        The most productive way to develop is to keep <Code>npm run dev</Code> running in one
        terminal window. Every time you save a file, tsup re-bundles the project in under 200 ms.
        You can then run <Code>node dist/cli.js &lt;url&gt;</Code> in another terminal to test
        your changes instantly.
      </P>
      <Note>
        The watch mode only rebuilds the bundle. It does not re-run type checking or tests.
        Run <Code>npm run typecheck</Code> and <Code>npm test</Code> separately before committing.
      </Note>

      <H3>Build output</H3>
      <P>
        The build produces a single ESM bundle at <Code>dist/cli.js</Code> with a Node.js shebang
        (<Code>#!/usr/bin/env node</Code>). This file is the entry point for both local development
        and the npm package. Despite the <Code>.js</Code> extension, the file is JavaScript output
        compiled from TypeScript. The bundle is intentionally small (~93 KB) — dependencies are
        externalized in the tsup configuration.
      </P>

      <H2>Project structure</H2>
      <P>
        The repository is organized as a monorepo with two main areas: the CLI application in the
        root and the documentation site in <Code>site/</Code>. Here is a breakdown of every
        directory and its purpose:
      </P>

      <H3>Root directory</H3>
      <Table
        headers={["Path", "Purpose"]}
        rows={[
          ["src/cli.tsx", "Entry point — argument parsing, Ink bootstrap, and TUI startup"],
          ["src/app.tsx", "Main TUI component — manages all application phases, keyboard input, state, and rendering"],
          ["src/components/", "Ink/React TUI components — text input, multi-select, logo, fullscreen wrapper, progress bar, keyboard shortcuts display, panel"],
          ["src/lib/", "Core utilities — yt-dlp integration (probe, download, chapters), argument parser, clipboard, platform detection, URL history, mouse event handling"],
          ["src/theme.ts", "Theme system — auto (follows terminal), light, and dark palettes, hot-swappable via Ctrl+T"],
          ["scripts/build-binary.js", "Bun SEA builder — compiles the CLI into a standalone binary for distribution"],
          ["scripts/build-binary.ts", "TypeScript source for the binary builder script"],
          ["dist/", "Build output — contains cli.js after tsup build, and platform binaries after build-binary (gitignored)"],
          ["docs/", "Legacy user-facing documentation in Markdown (being migrated to the site/ directory)"],
          ["assets/", "Images, demo GIFs, and logo SVGs used in README and documentation"],
          ["site/", "Next.js documentation website — separate package with its own dependencies"],
          [".github/", "GitHub Actions workflows (ci.yml, release.yml), issue templates, and community files"],
        ]}
      />

      <H3>Source code details</H3>
      <H4>src/cli.tsx — Entry point</H4>
      <P>
        This is where fetchit starts. It parses command-line arguments using the custom argument
        parser in <Code>src/lib/args.ts</Code>, determines whether to run in interactive (TUI) or
        scriptable (non-interactive) mode, and boots the Ink application. If scriptable mode is
        detected (flags like <Code>--best</Code>, <Code>--mp3</Code>, or a direct quality argument),
        it skips the TUI entirely and downloads directly.
      </P>

      <H4>src/app.tsx — Main TUI component</H4>
      <P>
        The heart of the interactive experience. This component manages all application phases:
        URL input, probing, format selection, downloading, and error handling. It wires up keyboard
        and mouse event handlers, manages the URL history, handles clipboard detection, and controls
        the theme system. The component is structured as a state machine where each phase renders a
        different set of child components.
      </P>

      <H4>src/components/ — TUI components</H4>
      <P>
        Individual Ink components that compose the user interface. Each file exports one or more
        React components that render directly to the terminal via Ink:
      </P>
      <Ul>
        <Li><Code>text-input.tsx</Code> — URL input field with readline-style editing, history recall via arrow keys, and clipboard paste detection</Li>
        <Li><Code>multi-select.tsx</Code> — Checkbox list component used for playlist item selection</Li>
        <Li><Code>logo.tsx</Code> — Animated ASCII fetchit logo rendered at startup</Li>
        <Li><Code>fullscreen.tsx</Code> — Full-screen terminal wrapper with centered layout and scrollback restoration on exit</Li>
        <Li><Code>progress-bar.tsx</Code> — Real-time download progress bar showing speed, ETA, and percentage</Li>
        <Li><Code>panel.tsx</Code> — Format panel displaying resolution, file size, and format metadata for user selection</Li>
        <Li><Code>shortcuts.tsx</Code> — Keyboard shortcut hints displayed in the footer</Li>
        <Li><Code>framed-input.tsx</Code> — Styled input wrapper used within the TUI</Li>
      </Ul>

      <H4>src/lib/ — Utilities and integrations</H4>
      <P>
        The library directory contains all non-component logic. This is where the real work happens:
      </P>
      <Ul>
        <Li><Code>ytdlp.ts</Code> — The download engine. Probes URLs, extracts format metadata, initiates downloads, handles playlists, and manages chapter embedding. All communication with yt-dlp happens here via child process spawning.</Li>
        <Li><Code>args.ts</Code> — Command-line argument parser. Handles flags (<Code>--best</Code>, <Code>--mp3</Code>, <Code>-o</Code>, etc.), positional arguments (URL, quality), and theme options.</Li>
        <Li><Code>clipboard.ts</Code> — Cross-platform clipboard access (sync and async) for detecting copied URLs on launch.</Li>
        <Li><Code>platforms.ts</Code> — Site detection and URL validation. Maps hostnames to display labels (YouTube, X/Twitter, Instagram, etc.).</Li>
        <Li><Code>history.ts</Code> — URL history persistence. Stores the last 50 URLs in <Code>~/.config/fetchit/history.json</Code>.</Li>
        <Li><Code>format.ts</Code> — Formatting utilities for file sizes, durations, and human-readable output.</Li>
        <Li><Code>click-map.ts</Code> — Frame capture system for mouse hit-testing. Maps terminal coordinates to clickable regions.</Li>
        <Li><Code>use-mouse-click.ts</Code> — React hook for SGR mouse event handling. Listens for <Code>SGR 1006</Code> mouse sequences and dispatches click events.</Li>
      </Ul>

      <H4>src/theme.ts — Theme system</H4>
      <P>
        Defines three color palettes: <Code>auto</Code> (inherits terminal foreground/background),
        <Code>light</Code>, and <Code>dark</Code>. The theme can be toggled at runtime via
        <Code>Ctrl+T</Code> or set on startup with <Code>--theme</Code>. Colors are defined as
        CSS-like variables and consumed by Ink components through React context.
      </P>

      <H3>scripts/ directory</H3>
      <P>
        Contains build tooling for producing standalone binaries. <Code>build-binary.js</Code> uses
        Bun's <Code>--compile</Code> flag to bundle the entire CLI, the Node.js runtime, and all
        dependencies into a single executable (~100 MB). The TypeScript source at
        <Code>build-binary.ts</Code> is compiled to <Code>build-binary.js</Code> before execution.
      </P>

      <H3>site/ directory</H3>
      <P>
        The documentation website is a standalone Next.js project (version 16) located in the
        <Code>site/</Code> subdirectory. It has its own <Code>package.json</Code>, dependencies, and
        build pipeline. The site is deployed to Vercel automatically when changes are pushed to
        <Code>main</Code>.
      </P>

      <H2>Making changes</H2>

      <H3>Branch naming convention</H3>
      <P>
        Create a new branch for each change. Use a descriptive name that reflects the work:
      </P>
      <Ul>
        <Li><Code>fix/description</Code> — Bug fixes (e.g., <Code>fix/playlist-concurrency</Code>)</Li>
        <Li><Code>feat/description</Code> — New features (e.g., <Code>feat/aria2-support</Code>)</Li>
        <Li><Code>docs/description</Code> — Documentation updates (e.g., <Code>docs/install-guide</Code>)</Li>
        <Li><Code>refactor/description</Code> — Code refactoring without behavior changes</Li>
        <Li><Code>test/description</Code> — Test additions or improvements</Li>
      </Ul>
      <P>
        Always branch from <Code>main</Code>:
      </P>
      <Pre>{`git checkout main
git pull upstream main
git checkout -b fix/your-bug-fix`}</Pre>

      <H3>Code style</H3>
      <P>
        fetchit follows a consistent code style enforced through conventions (not a formatter).
        Read through existing code before writing to match the style.
      </P>
      <Ul>
        <Li><strong>No semicolons.</strong> The codebase does not use semicolons. Keep it consistent.</Li>
        <Li><strong>TypeScript strict mode.</strong> The <Code>tsconfig.json</Code> enables <Code>strict: true</Code>. No <Code>any</Code> types, no <Code>@ts-ignore</Code> comments, and no <Code>as</Code> type casts unless absolutely necessary (with a comment explaining why).</Li>
        <Li><strong>No commented-out code.</strong> Delete it. Git history preserves the original.</Li>
        <Li><strong>No AI-generated contributions.</strong> Pull requests that appear to be written by an AI code assistant will be closed without review. Write your own code.</Li>
        <Li><strong>No em dashes (—) in user-facing text.</strong> Use commas, colons, or new sentences instead.</Li>
        <Li><strong>Keep the bundle small.</strong> The production bundle is ~93 KB. Think carefully before adding new dependencies.</Li>
        <Li><strong>Import style.</strong> Use ESM imports (<Code>import ... from "..."</Code>). No <Code>require()</Code> calls.</Li>
        <Li><strong>File extensions.</strong> Source files use <Code>.tsx</Code> for files containing JSX and <Code>.ts</Code> for pure TypeScript. Test files use <Code>.test.ts</Code>.</Li>
        <Li><strong>Naming conventions.</strong> Files use kebab-case (e.g., <Code>text-input.tsx</Code>). Functions and variables use camelCase. Components use PascalCase.</Li>
      </Ul>

      <H3>Commit guidelines</H3>
      <Ul>
        <Li>Write clear, descriptive commit messages in the imperative mood: <Code>fix: handle empty playlist gracefully</Code> rather than <Code>fixed bug</Code>.</Li>
        <Li>Keep commits focused. A commit should do one thing and include only related changes.</Li>
        <Li>Reference issues and pull requests in commit messages where applicable: <Code>feat: add --concurrency flag (#42)</Code>.</Li>
        <Li>Run <Code>npm run typecheck && npm test && npm run build</Code> before every commit to make sure your changes do not break anything.</Li>
      </Ul>

      <H2>Testing</H2>

      <H3>Running tests</H3>
      <P>
        fetchit uses Node.js built-in test runner (<Code>node:test</Code> and <Code>node:assert</Code>).
        There is no external test framework — just standard library APIs.
      </P>
      <Pre>{`npm test`}</Pre>
      <P>
        This runs <Code>tsx --test src/**/*.test.ts</Code>, which executes all test files matching
        the glob pattern. tsx compiles TypeScript on the fly, so tests run directly from source
        without a prior build step. Test files are colocated with their implementation files in
        <Code>src/</Code>:
      </P>
      <Ul>
        <Li><Code>src/lib/args.test.ts</Code> — Tests for the argument parser</Li>
        <Li><Code>src/lib/ytdlp.test.ts</Code> — Tests for the yt-dlp integration</Li>
        <Li><Code>src/components/panel.test.ts</Code> — Tests for the format panel component</Li>
      </Ul>
      <P>
        Run a single test file to iterate faster during development:
      </P>
      <Pre>{`npx tsx --test src/lib/args.test.ts`}</Pre>

      <H3>Writing tests</H3>
      <P>
        When adding new functionality, include tests that cover:
      </P>
      <Ul>
        <Li><strong>Happy path</strong> — the feature works as expected with valid input</Li>
        <Li><strong>Error handling</strong> — what happens with invalid input, missing data, or network failures</Li>
        <Li><strong>Edge cases</strong> — empty inputs, boundary values, unexpected formats</Li>
      </Ul>
      <P>
        Here is the pattern used across the test suite:
      </P>
      <Pre filename="src/lib/example.test.ts">{`import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { yourFunction } from "./your-module"

describe("yourFunction", () => {
  it("handles the happy path", () => {
    const result = yourFunction("valid input")
    assert.equal(result, "expected output")
  })

  it("throws on invalid input", () => {
    assert.throws(() => yourFunction("bad input"), /expected error/)
  })
})`}</Pre>
      <P>
        Use <Code>node:assert/strict</Code> for strict equality checks. Prefer <Code>assert.equal</Code>,
        <Code>assert.deepEqual</Code>, and <Code>assert.throws</Code> over loose comparisons.
        Use <Code>assert.ok</Code> for boolean assertions.
      </P>
      <Note>
        Ink components render to a virtual terminal during tests. For component tests, you can
        import and render components directly — Ink provides a <Code>render</Code> function that
        works in test environments without a real terminal.
      </Note>

      <H2>Building a binary (for testing)</H2>
      <P>
        If you need to test fetchit as a standalone binary — for example, to verify platform-specific
        behavior or to test the installer script — you can build a binary locally using Bun:
      </P>
      <Pre>{`bun scripts/build-binary.js`}</Pre>
      <P>
        This compiles the CLI into a standalone executable using Bun's <Code>--compile</Code> flag.
        The output is placed in <Code>dist/</Code>:
      </P>
      <Table
        headers={["Platform", "Output file"]}
        rows={[
          ["Windows", "dist/fetchit.exe"],
          ["macOS (Apple Silicon)", "dist/fetchit-darwin-arm64"],
          ["macOS (Intel)", "dist/fetchit-darwin-x64"],
          ["Linux (x86-64)", "dist/fetchit-linux-x64"],
          ["Linux (ARM64)", "dist/fetchit-linux-arm64"],
        ]}
      />
      <P>
        The binary embeds the Node.js runtime and all dependencies into a single file (~100 MB).
        It requires no external runtimes — you can copy it to any machine and run it directly:
      </P>
      <Pre>{`dist/fetchit.exe https://youtu.be/dQw4w9WgXcQ`}</Pre>
      <P>
        Note that the binary will download its own yt-dlp engine on first run, separate from any
        yt-dlp you may have installed system-wide.
      </P>
      <Note>
        Building a binary requires Bun to be installed. If you do not have Bun, you can still test
        fetchit via <Code>node dist/cli.js</Code> — the behavior is identical, just without the
        standalone packaging.
      </Note>

      <H2>Documentation</H2>
      <P>
        The official fetchit documentation lives in the <Code>site/</Code> directory, which is a
        Next.js 16 project. All documentation pages are written as React components in
        <Code>site/src/app/docs/</Code> using the prose components from
        <Code>@/components/prose</Code>.
      </P>

      <H3>How docs are organized</H3>
      <P>
        Each documentation topic is a subdirectory under <Code>site/src/app/docs/</Code> with a
        <Code>page.tsx</Code> file. The routing is automatic — <Code>site/src/app/docs/install/page.tsx</Code>
        becomes <Code>/docs/install</Code>. The current documentation pages are:
      </P>
      <Ul>
        <Li><Code>getting-started/</Code> — First run and basic usage</Li>
        <Li><Code>install/</Code> — All installation methods</Li>
        <Li><Code>interactive-mode/</Code> — Full-screen TUI reference</Li>
        <Li><Code>scriptable-mode/</Code> — Non-interactive usage and configuration</Li>
        <Li><Code>playlists/</Code> — Playlist downloading</Li>
        <Li><Code>troubleshooting/</Code> — Common issues and fixes</Li>
        <Li><Code>contributing/</Code> — This guide</Li>
      </Ul>

      <H3>Adding a new page</H3>
      <P>To add a new documentation page:</P>
      <Ol>
        <Li>
          Create a new directory under <Code>site/src/app/docs/your-topic/</Code>.
        </Li>
        <Li>
          Create a <Code>page.tsx</Code> file in that directory. Use the prose components to build
          the page content.
        </Li>
        <Li>
          Add a sidebar entry in <Code>site/src/components/sidebar.tsx</Code>. The sidebar defines
          the navigation sections and items. Add your page to the appropriate array
          (<Code>sidebarItems</Code>, <Code>guideItems</Code>, or <Code>supportItems</Code>).
        </Li>
      </Ol>

      <H3>Running the docs site locally</H3>
      <P>
        To preview documentation changes, start the Next.js development server from the
        <Code>site/</Code> directory:
      </P>
      <Pre>{`cd site
npm install
npm run dev`}</Pre>
      <P>
        This starts the dev server on <Code>http://localhost:3000</Code>. The site auto-reloads
        when you edit page files. The <Code>site/</Code> directory has its own
        <Code>package.json</Code> and dependencies — make sure to run <Code>npm install</Code> there
        before starting the server.
      </P>

      <H3>Documentation conventions</H3>
      <Ul>
        <Li>Use the prose components (<Code>H1</Code>, <Code>H2</Code>, <Code>P</Code>, <Code>Code</Code>, <Code>Pre</Code>, <Code>Ul</Code>, <Code>Ol</Code>, <Code>Li</Code>, <Code>Table</Code>, <Code>Note</Code>, <Code>Link</Code>, <Code>Blockquote</Code>) for consistent styling.</Li>
        <Li>Use <Code>Pre</Code> for code blocks. Pass a <Code>filename</Code> prop to show a filename header.</Li>
        <Li>Use <Code>Code</Code> for inline code, flag names, and file paths.</Li>
        <Li>Use <Code>Note</Code> for tips, warnings, and supplementary information.</Li>
        <Li>Use <Code>Table</Code> for structured data — command references, configuration options, supported platforms.</Li>
        <Li>Escape apostrophes with <Code>&amp;apos;</Code> in JSX text content.</Li>
        <Li>Link to other docs pages with <Code>Link href="/docs/topic"</Code>.</Li>
        <Li>Link to external resources (GitHub, npm, etc.) with standard <Code>a</Code> tags or <Code>Link</Code> with full URLs.</Li>
      </Ul>

      <H2>Pull request process</H2>
      <P>
        Follow these steps to submit a pull request that is easy to review and quick to merge.
      </P>

      <H3>Before opening a pull request</H3>
      <Ol>
        <Li><strong>Open an issue first</strong> for new features or non-trivial changes. This lets the maintainers and community discuss the approach before you invest time writing code. Bug fixes and documentation improvements can go straight to a PR.</Li>
        <Li><strong>Search existing issues and PRs</strong> to make sure no one else is already working on the same thing.</Li>
        <Li><strong>Keep it focused.</strong> One PR should do one thing. If you find yourself fixing multiple bugs or adding multiple features, split them into separate PRs.</Li>
      </Ol>

      <H3>Opening a pull request</H3>
      <Ol>
        <Li>Fork the repository and create a branch from <Code>main</Code> following the naming convention above.</Li>
        <Li>Make your changes. Write or update tests as needed.</Li>
        <Li>Run the full verification suite:
          <Pre>{`npm run typecheck
npm test
npm run build`}</Pre>
          All three must pass. If any fail, fix the issues before pushing.
        </Li>
        <Li>Push your branch to your fork and open a pull request targeting <Code>main</Code>.</Li>
        <Li>Write a clear PR description that explains:
          <Ul>
            <Li><strong>What</strong> changed — a summary of the code changes</Li>
            <Li><strong>Why</strong> it changed — the motivation, bug reference, or feature request link</Li>
            <Li><strong>How</strong> you tested it — what test cases you added or ran manually</Li>
            <Li><strong>Screenshots</strong> — for UI changes, include before/after terminal captures</Li>
          </Ul>
        </Li>
      </Ol>

      <H3>What happens after you open a PR</H3>
      <Ol>
        <Li><strong>CI checks run automatically.</strong> GitHub Actions executes <Code>npm run typecheck</Code>, <Code>npm test</Code>, and <Code>npm run build</Code>. A green checkmark means your changes are safe. A red cross means something failed — click "Details" to see the logs and fix the issue.</Li>
        <Li><strong>Code review.</strong> A maintainer will review your changes. They may request changes, ask questions, or approve. Respond to feedback promptly — address each comment or explain your reasoning.</Li>
        <Li><strong>Merge.</strong> Once approved, a maintainer will merge your PR. The squash-merge strategy is used to keep the commit history clean.</Li>
      </Ol>

      <Blockquote>
        First-time contributor? Welcome. Do not worry about getting everything perfect on the first
        try. Maintainers are happy to help you navigate the process. Open a draft pull request early
        if you want feedback on your approach.
      </Blockquote>

      <H3>CI/CD pipeline</H3>
      <P>
        fetchit uses GitHub Actions for continuous integration and delivery. All workflow
        definitions are in <Code>.github/workflows/</Code>.
      </P>

      <H4>Continuous Integration — <Code>ci.yml</Code></H4>
      <P>
        <strong>Trigger:</strong> Every push to <Code>main</Code> and every pull request targeting <Code>main</Code>.
      </P>
      <P>
        The CI workflow runs a single <Code>check</Code> job on an Ubuntu runner:
      </P>
      <Ol>
        <Li><Code>npm ci</Code> — Installs dependencies from <Code>package-lock.json</Code> (exact versions, faster than <Code>npm install</Code>)</Li>
        <Li><Code>npm run typecheck</Code> — TypeScript strict mode check via <Code>tsc --noEmit</Code></Li>
        <Li><Code>npm test</Code> — Runs all tests using Node's built-in test runner</Li>
        <Li><Code>npm run build</Code> — Bundles the project with tsup</Li>
      </Ol>

      <H4>Continuous Delivery — <Code>release.yml</Code></H4>
      <P>
        <strong>Trigger:</strong> Pushing a tag matching <Code>v*</Code> (e.g., <Code>v0.5.0</Code>).
      </P>
      <P>
        The CD workflow has three sequential jobs:
      </P>
      <Table
        headers={["Job", "Runner", "What it does"]}
        rows={[
          ["check", "Ubuntu", "Same as CI — typecheck, test, build. Cancels the release if this fails."],
          ["build-binary", "Windows, macOS, Linux (parallel)", "Builds a standalone binary on each OS using bun build --compile. Each binary is uploaded as a temporary artifact."],
          ["create-release", "Ubuntu", "Downloads all binaries, creates a GitHub Release, attaches binaries, and generates release notes automatically."],
        ]}
      />
      <P>
        The matrix strategy runs the build step on three operating systems simultaneously, producing
        one binary per platform:
      </P>
      <Table
        headers={["OS", "Runner", "Output file"]}
        rows={[
          ["Windows", "windows-latest", "fetchit-win-x64.exe"],
          ["macOS", "macos-latest", "fetchit-darwin-arm64"],
          ["Linux", "ubuntu-latest", "fetchit-linux-x64"],
        ]}
      />
      <P>
        The entire workflow typically completes in approximately 2 minutes. Release binaries are
        published at <Code>https://github.com/Vedant1521/fetchit/releases/latest/download/fetchit-&lt;os&gt;-&lt;arch&gt;</Code>.
      </P>

      <H2>Release process</H2>
      <P>
        This section is for maintainers who have push access to the repository. A release is
        triggered by pushing a version tag.
      </P>

      <H3>Creating a release</H3>
      <P>Follow these steps to publish a new version:</P>
      <Ol>
        <Li>
          <strong>Ensure main is up to date and CI passes.</strong>
          <Pre>{`git checkout main
git pull`}</Pre>
        </Li>
        <Li>
          <strong>Bump the version.</strong> Edit <Code>package.json</Code> to increment the version
          number following <Link href="https://semver.org/">semantic versioning</Link>:
          <Ul>
            <Li><strong>Patch</strong> (0.5.0 → 0.5.1) — Bug fixes and minor changes</Li>
            <Li><strong>Minor</strong> (0.5.0 → 0.6.0) — New features, backward compatible</Li>
            <Li><strong>Major</strong> (0.5.0 → 1.0.0) — Breaking changes</Li>
          </Ul>
          After editing, run <Code>npm install</Code> to sync <Code>package-lock.json</Code>.
        </Li>
        <Li>
          <strong>Commit and tag.</strong>
          <Pre>{`git commit -am "v0.x.x"
git tag v0.x.x`}</Pre>
        </Li>
        <Li>
          <strong>Push the tag.</strong> This triggers the release workflow in GitHub Actions.
          <Pre>{`git push && git push origin v0.x.x`}</Pre>
        </Li>
      </Ol>

      <H3>What happens during a release</H3>
      <P>The release workflow automates everything after the tag push:</P>
      <Ol>
        <Li><strong>Check job</strong> — Runs typecheck, tests, and tsup build to verify the code is production-ready.</Li>
        <Li><strong>Build-binary job</strong> — Spawns three parallel runners (Windows, macOS, Linux) that each execute <Code>scripts/build-binary.js</Code> to produce platform-specific standalone binaries.</Li>
        <Li><strong>Create-release job</strong> — Downloads all three binaries, creates a GitHub Release page with auto-generated release notes, attaches the binaries as download artifacts, and publishes the release.</Li>
      </Ol>

      <H3>npm publish</H3>
      <P>
        Publishing to npm is a manual step (not automated in CI). After the release workflow
        completes successfully:
      </P>
      <Pre>{`npm run build
npm publish`}</Pre>
      <P>
        This publishes the <Code>@vedant1521/fetchit</Code> package to the npm registry. The
        <Code>files</Code> field in <Code>package.json</Code> ensures only the <Code>dist/</Code>
        directory is included. The <Code>prepublishOnly</Code> script runs tests, typecheck, and
        build before publishing as a safety net.
      </P>

      <H3>Post-release</H3>
      <Ul>
        <Li>Update the install scripts (<Code>install.sh</Code> and <Code>install.ps1</Code>) if the release changes the download URL format or adds new platforms.</Li>
        <Li>Update the documentation site if the release introduces new features or changes existing behavior.</Li>
        <Li>Post a summary in the GitHub Discussion or on social media if the release includes significant changes.</Li>
      </Ul>

      <H2>What needs help</H2>
      <P>
        Not sure where to start? Here are the areas where contributions are most valuable:
      </P>
      <Ul>
        <Li><strong>Bug reports</strong> with clear reproduction steps — open an issue with the <Code>bug</Code> label</Li>
        <Li><strong>Test coverage</strong> — the test suite is growing but could use more edge case and error path coverage</Li>
        <Li><strong>Documentation</strong> — improvements to existing guides, new guides, troubleshooting entries, and code comments</Li>
        <Li><strong>Platform packages</strong> — package fetchit for system package managers: Homebrew (macOS), Scoop/Winget (Windows), APT/RPM (Linux)</Li>
        <Li><strong>Accessibility</strong> — improve keyboard navigation, screen reader support in the terminal, and color-blind friendly themes</Li>
        <Li><strong>Performance</strong> — optimize probe caching, reduce binary size, improve download concurrency</Li>
      </Ul>
      <P>
        Check the <Link href="https://github.com/Vedant1521/fetchit/issues">issues page</Link> for
        open bugs and feature requests. Issues labeled <Code>good first issue</Code> are especially
        suitable for new contributors.
      </P>

      <H2>Code of conduct</H2>
      <P>
        Be decent. Disagreement is fine — personal attacks are not. fetchit is a small open-source
        project run by one person. Treat it, its maintainers, and its users the way you would want
        someone to treat your own project. Harassment, trolling, and disrespectful behavior will not
        be tolerated.
      </P>

      <H2>Getting help</H2>
      <P>
        If you have questions about contributing, need guidance on your first PR, or want to discuss
        an idea before writing code:
      </P>
      <Ul>
        <Li>Open a <Link href="https://github.com/Vedant1521/fetchit/discussions">GitHub Discussion</Link></Li>
        <Li>Open an <Link href="https://github.com/Vedant1521/fetchit/issues">issue</Link> (search first to see if someone already asked)</Li>
        <Li>Read the <Link href="/docs">documentation</Link> for detailed usage guides</Li>
      </Ul>
      <P>
        We are glad you are here. Happy contributing.
      </P>
    </Prose>
  )
}
