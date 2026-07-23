import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"
import { MultiPlatformCodeTabs } from "@/components/multi-platform-code-tabs"

export const metadata: Metadata = { title: "Install Guide" }

export default function Install() {
  return (
    <Prose>
      <H1>Install Guide</H1>
      <P>
        FETCHIT is distributed as a standalone binary, an npm package, and source code. You can install it on macOS, Linux, and Windows using any of the methods below. Choose the approach that best fits your environment — whether you are setting up a dev machine, provisioning a CI pipeline, or deploying to a Docker container.
      </P>

      <Table
        headers={["Method", "Requires", "Binary size", "Best for"]}
        rows={[
          ["curl/sh one-liner", "Nothing (auto-detects)", "~100 MB", "Most users / scripts"],
          ["PowerShell one-liner", "Windows 10+ / PowerShell 5+", "~100 MB", "Windows users"],
          ["npm install -g", "Node.js 18+", "~93 KB (npm meta)", "Node.js developers"],
          ["npx", "Node.js 18+", "~93 KB (cached)", "Trying once / CI"],
          ["Build from source", "Node.js 18+ + git + Bun (optional)", "~100 MB", "Contributors / forks"],
          ["Docker", "Docker 20+", "~120 MB (image)", "Containerised environments"],
        ]}
      />

      <H2>System requirements</H2>
      <P>
        Before installing, make sure your environment meets these minimum requirements.
      </P>
      <Ul>
        <Li><strong>Operating system:</strong> macOS 12+ (Intel & Apple Silicon), Windows 10+ (x64), or Linux (x64, glibc &ge; 2.28, or musl-based distros like Alpine 3.17+). ARM Linux is supported experimentally — binaries are built for aarch64.</Li>
        <Li><strong>Architecture:</strong> x86_64 (amd64) and aarch64 (ARM64). 32-bit systems are not supported.</Li>
        <Li><strong>Disk space:</strong> Approximately 250 MB free after installation — ~100 MB for the binary, ~100 MB for the bundled yt-dlp engine, and headroom for temporary downloads and cache.</Li>
        <Li><strong>Permissions:</strong> The installer script needs write access to <Code>~/.fetchit</Code>. The npm install path may require <Code>sudo</Code> on POSIX systems depending on your Node.js setup. On Windows, admin rights are <em>not</em> required unless you are installing a system-wide npm package.</Li>
        <Li><strong>Network:</strong> Outbound HTTPS access to <Code>github.com</Code>, <Code>registry.npmjs.org</Code>, and <Code>fetchit-cli.vercel.app</Code>.</Li>
      </Ul>

      <H2>Quick start (one-liner)</H2>
      <P>
        The recommended way to install fetchit for most users. The installer auto-detects your platform, downloads the correct binary, sets up PATH, and pre-fetches the yt-dlp engine — all in a single command.
      </P>

      <H3>Multi-Platform Installation</H3>
      <P>
        Select your operating system or package manager below to get the recommended one-line installation command:
      </P>

      <MultiPlatformCodeTabs title="Install fetchit" />
      <P>
        The PowerShell variant uses <Code>Invoke-RestMethod</Code> (<Code>irm</Code>) to download the installer script and <Code>Invoke-Expression</Code> (<Code>iex</Code>) to execute it in one pipeline.
      </P>

      <Note>
        If you are behind a corporate proxy or firewall, set the <Code>HTTP_PROXY</Code> or <Code>HTTPS_PROXY</Code> environment variable before running the one-liner. The installer respects these variables for all outbound requests.
      </Note>

      <H3>What the installer script does, step by step</H3>
      <P>
        Understanding the installer helps you debug issues and know exactly what changes are made to your system.
      </P>
      <Ol>
        <Li><strong>Platform detection.</strong> The script reads <Code>uname -s</Code> and <Code>uname -m</Code> (or <Code>PROCESSOR_ARCHITECTURE</Code> on Windows) to select the correct binary archive. It supports <Code>darwin</Code> / <Code>linux</Code> / <Code>win32</Code> on <Code>x86_64</Code> and <Code>aarch64</Code>. If the platform is unknown, the script exits with a clear error message listing supported targets.</Li>
        <Li><strong>Node.js check (optional shortcut).</strong> If <Code>node --version</Code> reports 18 or higher, the script offers to install via npm instead of the standalone binary (unless the <Code>--binary</Code> flag is passed). This produces a smaller install and integrates with your existing Node.js toolchain.</Li>
        <Li><strong>Binary download.</strong> The script fetches the latest release tarball from <Code>https://github.com/Vedant1521/fetchit/releases/latest</Code>. It uses <Code>curl</Code> (or <Code>Invoke-WebRequest</Code> on Windows) with a 30-second timeout and retries on failure. The archive is streamed and extracted in memory to avoid leaving temp files.</Li>
        <Li><strong>Installation directory.</strong> The binary is placed at <Code>~/.fetchit/bin/fetchit</Code> (or <Code>~\.fetchit\bin\fetchit.exe</Code> on Windows). This directory is created if it does not exist. If a previous installation is detected, the old binary is backed up as <Code>fetchit.old</Code> before replacement.</Li>
        <Li><strong>PATH configuration.</strong> The script appends the binary directory to your shell profile: <Code>~/.bashrc</Code>, <Code>~/.zshrc</Code>, <Code>~/.config/fish/config.fish</Code>, or the PowerShell profile (<Code>$PROFILE</Code>). It uses <Code>grep</Code> to avoid duplicate entries. If the profile is read-only or cannot be detected, a warning is printed with manual instructions.</Li>
        <Li><strong>Engine pre-fetch.</strong> fetchit downloads the yt-dlp engine on first use. The installer runs <Code>fetchit doctor</Code> immediately to trigger this download so that the first real command is fast. If the download fails (e.g. no network), the installation still succeeds — the engine is fetched lazily on first invocation.</Li>
        <Li><strong>Cleanup & verification.</strong> Temporary files are removed and the script prints the installed version via <Code>fetchit --version</Code>. If the binary does not run (e.g. missing <Code>glibc</Code> version), the script falls back to the npm installation path automatically.</Li>
      </Ol>

      <Blockquote>
        The installer script is open source and auditable. You can inspect it at <Link href="https://github.com/Vedant1521/fetchit/blob/main/scripts/install.sh">scripts/install.sh</Link> or <Link href="https://github.com/Vedant1521/fetchit/blob/main/scripts/install.ps1">scripts/install.ps1</Link> before running it.
      </Blockquote>

      <H2>Install via npm</H2>
      <P>
        If you already work with Node.js, installing fetchit through npm keeps everything within your existing package manager workflow. The npm package is a thin wrapper that installs the platform-specific binary as a dependency.
      </P>

      <H3>Global installation</H3>
      <Pre>{`npm install -g @vedant1521/fetchit`}</Pre>
      <P>
        This installs fetchit globally so the <Code>fetchit</Code> command is available in your terminal. On POSIX systems, global installs are often placed in <Code>/usr/local/lib/node_modules</Code>; you may need <Code>sudo</Code> or a configured <Code>npm prefix</Code>. On Windows, the executable is placed in <Code>%APPDATA%\npm</Code>, which is typically already on your PATH.
      </P>

      <H3>Version pinning</H3>
      <Pre>{`npm install -g @vedant1521/fetchit@1.2.3`}</Pre>
      <P>
        Pinning to a specific version is recommended for production environments and CI/CD pipelines. This prevents unexpected breaking changes when new versions are published. Check the <Link href="https://github.com/Vedant1521/fetchit/releases">releases page</Link> for available versions.
      </P>

      <H3>Verifying the npm install</H3>
      <Pre>{`npm list -g @vedant1521/fetchit
fetchit --version`}</Pre>
      <P>
        The first command confirms the package is installed in the global registry. The second prints the semantic version of the binary. If the version does not match what you expected, run <Code>npm outdated -g @vedant1521/fetchit</Code> to check for newer releases.
      </P>

      <H3>Run without installing (npx)</H3>
      <Pre>{`npx @vedant1521/fetchit`}</Pre>
      <P>
        The <Code>npx</Code> runner downloads and caches the latest fetchit package on demand. It is perfect for one-off uses, quick tests, or CI steps where you do not want to manage a global install. The cache lives in <Code>~/.npm/_npx</Code> and is cleaned automatically.
      </P>

      <Note>
        npx requires an active network connection on first run. Subsequent invocations use the cached copy until the cache TTL expires (typically 30 days) or you pass <Code>--fresh</Code> to force a re-download.
      </Note>

      <H2>Build from source</H2>
      <P>
        Building fetchit from source gives you full control over the compilation process. This is useful for contributing patches, testing unreleased changes, or customising the build for a non-standard environment.
      </P>

      <H3>Prerequisites</H3>
      <Ul>
        <Li><strong>Node.js</strong> version 18 or later. Verify with <Code>node --version</Code>. We recommend the latest LTS release.</Li>
        <Li><strong>npm</strong> version 9 or later (ships with Node.js 18+).</Li>
        <Li><strong>Git</strong> to clone the repository.</Li>
        <Li><strong>Bun</strong> (optional) — required only if you want to generate a standalone binary via <Code>scripts/build-binary.js</Code>. Install with <Code>curl -fsSL https://bun.sh/install | bash</Code>.</Li>
        <Li><strong>C/C++ build tools</strong> — native modules are compiled from source. On macOS, install Xcode Command Line Tools (<Code>xcode-select --install</Code>). On Linux, install <Code>build-essential</Code> (Debian/Ubuntu) or <Code>base-devel</Code> (Arch). On Windows, install <Code>windows-build-tools</Code> via <Code>npm install --global windows-build-tools</Code>.</Li>
      </Ul>

      <H3>Step-by-step</H3>
      <P>
        Follow these steps exactly. Each stage has been tested on macOS, Ubuntu 22.04, and Windows Server 2022.
      </P>
      <Ol>
        <Li>
          <strong>Clone the repository.</strong>
          <Pre>{`git clone https://github.com/Vedant1521/fetchit.git
cd fetchit`}</Pre>
          This fetches the full history. If you only want the latest revision, add <Code>--depth 1</Code> to the clone command.
        </Li>
        <Li>
          <strong>Install dependencies.</strong>
          <Pre>{`npm install`}</Pre>
          This resolves and installs all Node.js dependencies listed in <Code>package.json</Code>. Native addons are compiled from source during this step, which is why build tools are required.
        </Li>
        <Li>
          <strong>Build the project.</strong>
          <Pre>{`npm run build`}</Pre>
          The build script runs the TypeScript compiler (<Code>tsc</Code>) and bundles the output. If the build fails, check that your TypeScript version matches the one in <Code>package.json</Code> and that there are no type errors.
        </Li>
        <Li>
          <strong>Link the CLI (optional).</strong>
          <Pre>{`npm link`}</Pre>
          This creates a symlink in your global npm prefix so you can run <Code>fetchit</Code> from any directory without specifying the path. Useful during development.
        </Li>
      </Ol>

      <H3>Generate a standalone binary</H3>
      <P>
        Building a standalone binary bundles the entire CLI along with a Node.js runtime into a single executable. This binary does not require Node.js to be installed on the target machine.
      </P>
      <Pre>{`npm install
bun scripts/build-binary.js`}</Pre>
      <P>
        The output binary is placed at <Code>dist/fetchit</Code> on macOS and Linux, or <Code>dist/fetchit.exe</Code> on Windows. The binary is approximately 100 MB because it embeds the Node.js runtime and all dependencies.
      </P>
      <P>
        You can move this binary to any directory on your PATH and run it independently. No additional DLLs, shared libraries, or runtimes are required.
      </P>

      <Note>
        The standalone binary is statically linked on Linux and statically compiled on macOS. On Windows, it is compiled with <Code>/MT</Code> so no Visual C++ redistributable is needed.
      </Note>

      <H2>Docker installation</H2>
      <P>
        fetchit is available as a Docker image for containerised environments. The image is based on <Code>node:22-alpine</Code> and includes the binary pre-installed.
      </P>

      <H3>Pull the image</H3>
      <Pre>{`docker pull ghcr.io/vedant1521/fetchit:latest`}</Pre>

      <H3>Run a one-off command</H3>
      <Pre>{`docker run --rm ghcr.io/vedant1521/fetchit fetchit --help`}</Pre>

      <H3>Use as a base image</H3>
      <Pre>{`FROM ghcr.io/vedant1521/fetchit:latest AS fetchit
# ... your build steps

COPY --from=fetchit /usr/local/bin/fetchit /usr/local/bin/fetchit`}</Pre>

      <H3>Docker Compose</H3>
      <Pre>{`services:
  fetcher:
    image: ghcr.io/vedant1521/fetchit:latest
    command: ["fetchit", "download", "https://example.com/video", "-o", "/data/video.mp4"]
    volumes:
      - ./data:/data`}</Pre>

      <H2>CI/CD installation</H2>
      <P>
        Integrate fetchit into your continuous integration pipelines. These recipes work with GitHub Actions, GitLab CI, and CircleCI out of the box.
      </P>

      <H3>GitHub Actions</H3>
      <Pre>{`- name: Install fetchit
  run: curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh

- name: Use fetchit
  run: fetchit download <url> -o output.mp4`}</Pre>
      <P>
        For faster installs, use the npm route (GitHub Actions runners have Node.js pre-installed):
      </P>
      <Pre>{`- name: Install fetchit (npm)
  run: npm install -g @vedant1521/fetchit@1.2.3

- name: Verify
  run: fetchit --version`}</Pre>

      <H3>GitLab CI</H3>
      <Pre>{`install-fetchit:
  before_script:
    - curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh
  script:
    - fetchit download <url> -o output.mp4`}</Pre>

      <H3>CircleCI</H3>
      <Pre>{`version: 2.1
jobs:
  download:
    docker:
      - image: cimg/node:22.0
    steps:
      - run: npm install -g @vedant1521/fetchit
      - run: fetchit --version`}</Pre>

      <H2>Installing a specific version</H2>
      <P>
        You may need to install an older release for compatibility reasons or pin to a specific version for reproducible builds.
      </P>

      <H3>One-liner with version flag</H3>
      <Pre>{`curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh -s -- --version 1.2.3`}</Pre>
      <P>
        The <Code>--version</Code> flag overrides the default "latest" behaviour. The installer resolves the version tag against the GitHub Releases API.
      </P>

      <H3>npm with exact version</H3>
      <Pre>{`npm install -g @vedant1521/fetchit@1.2.3`}</Pre>

      <H3>Direct binary download</H3>
      <P>
        You can skip the installer entirely and download the binary archive directly from GitHub:
      </P>
      <Pre>{`# macOS (Apple Silicon)
curl -fsSL https://github.com/Vedant1521/fetchit/releases/download/v1.2.3/fetchit-darwin-arm64.tar.gz | tar xz -C /usr/local/bin

# Linux (x64)
curl -fsSL https://github.com/Vedant1521/fetchit/releases/download/v1.2.3/fetchit-linux-x64.tar.gz | tar xz -C /usr/local/bin

# Windows (x64) via PowerShell
Invoke-WebRequest -Uri "https://github.com/Vedant1521/fetchit/releases/download/v1.2.3/fetchit-win32-x64.zip" -OutFile fetchit.zip
Expand-Archive -Path fetchit.zip -DestinationPath "$env:LOCALAPPDATA\fetchit"`}</Pre>

      <H2>Verifying your installation</H2>
      <P>
        After installation, run these checks to confirm everything works correctly.
      </P>

      <H3>Check the version</H3>
      <Pre>{`fetchit --version`}</Pre>
      <P>
        Prints the installed semantic version (e.g. <Code>1.2.3</Code>). If this command fails, fetchit is not on your PATH.
      </P>

      <H3>Run the doctor command</H3>
      <Pre>{`fetchit doctor`}</Pre>
      <P>
        The <Code>doctor</Code> command runs a comprehensive health check: it verifies the binary integrity, checks that the yt-dlp engine is present and up to date, confirms network connectivity to the YouTube API, and validates your configuration file. If any check fails, it prints a descriptive error and suggested fix.
      </P>

      <H3>Test a real download</H3>
      <Pre>{`fetchit --best "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -o /dev/null`}</Pre>
      <P>
        Downloads a short audio stream to <Code>/dev/null</Code> (or <Code>nul</Code> on Windows) to validate the full pipeline — engine invocation, streaming, and output. If this succeeds, fetchit is fully operational.
      </P>

      <H2>PATH setup (manual)</H2>
      <P>
        If the installer could not modify your shell profile — for example, your profile is read-only, stored in a non-standard location, or the auto-detection failed — you can add fetchit to your PATH manually.
      </P>

      <H3>macOS / Linux</H3>
      <P>Add the following line to <Code>~/.bashrc</Code>, <Code>~/.zshrc</Code>, or <Code>~/.config/fish/config.fish</Code> depending on your shell:</P>
      <Pre>{`export PATH="$HOME/.fetchit/bin:$PATH"`}</Pre>
      <P>Then reload your shell configuration:</P>
      <Pre>{`source ~/.zshrc   # or ~/.bashrc, etc.`}</Pre>

      <H3>Windows</H3>
      <P>Run this PowerShell command to add the directory to your user PATH permanently:</P>
      <Pre>{`[Environment]::SetEnvironmentVariable(
  "PATH",
  [Environment]::GetEnvironmentVariable("PATH", "User") + ";$env:USERPROFILE\.fetchit\bin",
  "User"
)`}</Pre>
      <P>Restart your terminal for the change to take effect.</P>

      <Note>
        The installer places the binary at <Code>~/.fetchit/bin/fetchit</Code>. If you prefer a different location, move the binary and adjust the PATH entry accordingly.
      </Note>

      <H2>Upgrading fetchit</H2>
      <P>
        Keeping fetchit up to date ensures you have the latest features, bug fixes, and engine compatibility.
      </P>

      <H3>Re-run the installer (recommended)</H3>
      <Pre>{`curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`}</Pre>
      <P>
        The installer is idempotent — running it again overwrites the old binary with the latest version, updates the PATH if needed, and re-fetches the yt-dlp engine. Your existing configuration in <Code>~/.fetchit/config.json</Code> is preserved.
      </P>

      <H3>npm global update</H3>
      <Pre>{`npm update -g @vedant1521/fetchit`}</Pre>

      <H3>Check for updates</H3>
      <Pre>{`fetchit --version
# Then compare with the latest on:
# https://github.com/Vedant1521/fetchit/releases/latest`}</Pre>
      <P>
        fetchit does not phone home for version checks. You are responsible for keeping it updated. Subscribe to the <Link href="https://github.com/Vedant1521/fetchit/releases.atom">GitHub releases RSS feed</Link> to receive notifications.
      </P>

      <H2>Uninstalling fetchit</H2>
      <P>
        Removing fetchit completely involves deleting the binary, its data directory, and optionally the npm global package.
      </P>

      <H3>Standalone binary install</H3>
      <Pre>{`rm -rf ~/.fetchit`}</Pre>
      <P>
        This removes the binary, the yt-dlp engine, downloaded cache files, and configuration. If you also added PATH entries manually, remove the relevant lines from your shell profile.
      </P>

      <H3>npm install</H3>
      <Pre>{`npm uninstall -g @vedant1521/fetchit`}</Pre>
      <P>
        This removes the npm package. Global binaries linked by npm are deleted automatically. The <Code>~/.fetchit</Code> data directory is <em>not</em> removed by npm — delete it separately if you want a clean sweep.
      </P>

      <H3>Complete removal (all paths)</H3>
      <Pre>{`rm -rf ~/.fetchit
npm uninstall -g @vedant1521/fetchit
# Also remove any manually downloaded binaries
rm /usr/local/bin/fetchit   # if you placed it here`}</Pre>

      <H2>Platform-specific troubleshooting</H2>
      <P>
        If you run into issues, consult the section for your operating system. Most problems have straightforward workarounds.
      </P>

      <H3>Windows</H3>
      <Ul>
        <Li><strong>SmartScreen / Windows Defender.</strong> The first time you run the <Code>.exe</Code>, Windows may show "Windows protected your PC." Click "More info" then "Run anyway." This happens because the binary is not code-signed. You can verify the binary's SHA-256 checksum against the published hash in the release notes.</Li>
        <Li><strong>PowerShell execution policy.</strong> If you see "running scripts is disabled on this system," run <Code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</Code> and try again. This allows locally downloaded scripts to run.</Li>
        <Li><strong>Path too long.</strong> The installer places the binary in <Code>%USERPROFILE%\.fetchit\bin</Code>. If your username contains spaces, the path is quoted automatically. If you encounter "command not found" after installation, restart your terminal or add the path manually (see PATH setup above).</Li>
        <Li><strong>Antivirus false positives.</strong> Some antivirus software may flag the standalone binary because it embeds a Node.js runtime. This is a known false positive. Add the binary to your antivirus exclusion list or use the npm installation method instead.</Li>
        <Li><strong>Node.js not found after npm install.</strong> If <Code>npm install -g</Code> succeeds but <Code>fetchit</Code> is not recognized, ensure your npm global bin directory is on PATH. Run <Code>npm config get prefix</Code> and add the <Code>bin</Code> subdirectory to your PATH.</Li>
      </Ul>

      <H3>macOS</H3>
      <Ul>
        <Li><strong>Gatekeeper.</strong> The binary is not notarised by Apple. When you run it for the first time, macOS may show "fetchit cannot be opened because the developer cannot be verified." Right-click the binary in Finder, select "Open," and confirm the dialog. This adds a security exception for that specific binary.</Li>
        <Li><strong>Quarantine attribute.</strong> If you prefer the command line, remove the quarantine extended attribute manually: <Pre>{`xattr -d com.apple.quarantine ~/.fetchit/bin/fetchit`}</Pre>This tells macOS that the binary has been vetted by you.</Li>
        <Li><strong>Apple Silicon (M1/M2/M3).</strong> The ARM64 binary is a native build — it does not run through Rosetta 2. Performance is equivalent to Intel builds. If you are using npm, Node.js must also be ARM-native; an x64 Node.js will work but runs under Rosetta with slightly lower performance.</Li>
        <Li><strong>macOS 15 (Sequoia) compatibility.</strong> fetchit is tested on Sequoia. If you encounter permission prompts for network access, grant them in System Settings &gt; Privacy & Security.</Li>
        <Li><strong>Code signing identity.</strong> If you are building from source and distribute the binary internally, you can self-sign it with <Code>codesign -s "Your Identity" dist/fetchit</Code> to suppress Gatekeeper warnings.</Li>
      </Ul>

      <H3>Linux</H3>
      <Ul>
        <Li><strong>glibc version mismatch.</strong> The prebuilt binary is linked against glibc 2.28 (equivalent to RHEL 8 / Ubuntu 20.04). If your system uses an older glibc (e.g. CentOS 7), the binary will fail with <Code>version GLIBC_2.28 not found</Code>. In this case, use the npm installation method or build from source.</Li>
        <Li><strong>musl-based distros (Alpine).</strong> A separate musl-linked binary is provided for Alpine Linux. The installer auto-detects musl via <Code>/lib/ld-musl-x86_64.so.1</Code> existence. If the installer picks the wrong binary, force the install with <Code>--target linux-musl-x64</Code>.</Li>
        <Li><strong>Missing shared libraries.</strong> Though the binary is statically linked, certain system calls (e.g. DNS resolution via <Code>libnss</Code>) may depend on system libraries. If you see <Code>Error: spawn ENOENT</Code>, ensure <Code>/etc/resolv.conf</Code> is present and <Code>ca-certificates</Code> is installed.</Li>
        <Li><strong>Permissions on <Code>/usr/local/bin</Code>.</strong> If you manually place the binary in a system directory, you may need <Code>sudo</Code>. Prefer <Code>~/.local/bin</Code> or <Code>~/.fetchit/bin</Code> to avoid permission issues.</Li>
        <Li><strong>SELinux / AppArmor.</strong> On security-hardened distros, the binary may be restricted. Check <Code>audit.log</Code> for AVC denials. You can add a local policy module or run fetchit from an unconfined domain.</Li>
      </Ul>

      <H2>Environment variables that affect installation</H2>
      <P>
        The installer and fetchit itself respect several environment variables. Setting these can alter behaviour without modifying command-line arguments.
      </P>
      <Table
        headers={["Variable", "Affects", "Description"]}
        rows={[
          ["FETCHIT_VERSION", "Installer", "Pin installation to a specific semver (e.g. 1.2.3). Equivalent to --version."],
          ["FETCHIT_BINARY_DIR", "Installer", "Install the binary to a custom directory instead of ~/.fetchit/bin."],
          ["FETCHIT_SKIP_ENGINE", "Installer", "If set to 1, skip pre-fetching the yt-dlp engine after installation."],
          ["FETCHIT_SKIP_PATH", "Installer", "If set to 1, do not modify shell profile for PATH."],
          ["HTTP_PROXY / HTTPS_PROXY", "Installer & fetchit", "Route all outbound HTTP(S) traffic through the specified proxy."],
          ["NO_PROXY", "Installer & fetchit", "Comma-separated list of hosts / domains that bypass the proxy."],
          ["NPM_CONFIG_REGISTRY", "npm install", "Use a custom npm registry (e.g. for offline / air-gapped installs)."],
          ["npm_config_global", "npm install", "Set to true to force global installation context."],
        ]}
      />
      <P>
        Example usage:
      </P>
      <Pre>{`FETCHIT_VERSION=1.2.3 FETCHIT_BINARY_DIR=/opt/fetchit curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh`}</Pre>

      <H2>Installing in air-gapped / offline environments</H2>
      <P>
        If your machine has no internet access, you can still install fetchit using a side-loaded approach:
      </P>
      <Ol>
        <Li>On a machine with internet, download the binary archive from the <Link href="https://github.com/Vedant1521/fetchit/releases">GitHub Releases</Link> page for your target platform.</Li>
        <Li>Transfer the archive via USB drive, internal network share, or your organisation's artifact repository.</Li>
        <Li>Extract the archive and place the binary in a directory on PATH (e.g. <Code>/usr/local/bin</Code> or <Code>~/.fetchit/bin</Code>).</Li>
        <Li>The yt-dlp engine will not be available offline. Pass <Code>--engine-path /path/to/yt-dlp</Code> to each invocation if you have a local copy, or download it separately from <Link href="https://github.com/yt-dlp/yt-dlp/releases">yt-dlp's releases</Link>.</Li>
      </Ol>

      <H2>Next steps</H2>
      <P>
        Now that fetchit is installed, read the <Link href="/docs/usage">Usage Guide</Link> to learn how to download videos, extract audio, manage playlists, and customise output formats. Run <Code>fetchit --help</Code> any time for a quick reference of all commands and flags.
      </P>
    </Prose>
  )
}
