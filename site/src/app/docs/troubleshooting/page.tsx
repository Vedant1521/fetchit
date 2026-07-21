import type { Metadata } from "next"
import { Prose, H1, H2, H3, H4, P, Code, Pre, Ul, Ol, Li, Table, Note, Link, Blockquote } from "@/components/prose"

export const metadata: Metadata = { title: "Troubleshooting" }

export default function Troubleshooting() {
  return (
    <Prose>
      <H1>Troubleshooting</H1>
      <P>
        This guide covers common issues you may encounter while using fetchit and how to resolve them.
        If your problem persists after trying the suggestions here, please{" "}
        <Link href="https://github.com/Vedant1521/fetchit/issues">open a GitHub issue</Link> with
        the details described at the bottom of this page.
      </P>

      <H2>Getting Help</H2>
      <P>
        Before diving into specific error sections below, there are a few quick ways to gather
        diagnostic information that will help both you and the maintainers identify the problem.
      </P>

      <H3>Verbose / Debug Output</H3>
      <P>
        The single most useful thing you can do when encountering an error is re-run the command
        with verbose logging enabled. This prints the exact yt-dlp command being executed, the full
        stdout and stderr streams, and any internal fetchit state.
      </P>
      <Pre>{`fetchit --verbose https://youtube.com/watch?v=...

# Short form also works
fetchit -v https://youtube.com/watch?v=...`}</Pre>
      <P>
        Verbose mode shows the raw yt-dlp output, including HTTP requests, extractor debug
        information, and error traces. When opening a bug report, always include the full output
        from a verbose run.
      </P>

      <H3>Log Files</H3>
      <P>
        fetchit writes logs to a persistent location on your system. These logs persist across
        sessions and can be inspected even after the terminal has been closed.
      </P>
      <Table headers={["Platform", "Log location"]} rows={[
        ["Linux / macOS", "~/.local/share/fetchit/logs/"],
        ["Windows", "%USERPROFILE%\\.fetchit\\logs\\"],
      ]} />
      <P>Each run creates a timestamped log file:</P>
      <Pre>{`~/.local/share/fetchit/logs/fetchit-2026-07-21T14-30-00.log`}</Pre>
      <P>
        To tail the latest log in real-time during a download:
      </P>
      <Pre>{`# Linux / macOS
tail -f ~/.local/share/fetchit/logs/$(ls -t ~/.local/share/fetchit/logs/ | head -1)

# PowerShell
Get-Content "$env:USERPROFILE\.fetchit\logs\$(Get-ChildItem "$env:USERPROFILE\.fetchit\logs" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty Name)" -Wait`}</Pre>

      <H3>Configuration Dump</H3>
      <P>
        If you suspect a configuration issue, you can dump the effective settings fetchit is using:
      </P>
      <Pre>{`fetchit config dump`}</Pre>
      <P>
        This prints the merged configuration from all sources (system config, user config, CLI
        flags, environment variables) as JSON.
      </P>

      <H3>Environment Diagnostics</H3>
      <P>
        Run the diagnostic command to check your environment for common prerequisites:
      </P>
      <Pre>{`fetchit doctor

# Checks performed:
#   ✓ Node.js version >= 18
#   ✓ yt-dlp installed and executable
#   ✓ ffmpeg available (if needed)
#   ✓ Write permissions on download directory
#   ✓ Network connectivity to YouTube
#   ✓ Proxy environment variables`}</Pre>

      <H2>Installation Errors</H2>

      <H3>Permission denied during install (Unix)</H3>
      <P>
        If you see <Code>EACCES: permission denied</Code> when installing fetchit via npm globally:
      </P>
      <Ul>
        <Li>
          <strong>Do not use <Code>sudo npm install -g</Code>.</strong> Using sudo with npm can
          lead to permission errors later and is a security risk.
        </Li>
        <Li>
          Instead, reinstall npm with a prefix you own, or use a version manager. See{" "}
          <Link href="https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally">
            npm&apos;s official guide
          </Link>.
        </Li>
        <Li>
          Recommended: use <Code>npx</Code> to run fetchit without installing globally:
          <Pre>{`npx fetchit https://...`}</Pre>
        </Li>
      </Ul>

      <H3>npm global install fails</H3>
      <P>
        Global npm installs can fail for several reasons. The most common fixes:
      </P>
      <Ul>
        <Li>
          <strong>Outdated npm:</strong> <Code>npm install -g npm@latest</Code> then retry.
        </Li>
        <Li>
          <strong>Registry issues:</strong> If you are behind a corporate proxy or in a region
          with restricted access, npm installs may time out. Configure a mirror:
          <Pre>{`npm config set registry https://registry.npmmirror.com`}</Pre>
        </Li>
        <Li>
          <strong>Lockfile conflicts:</strong> Delete <Code>node_modules</Code> and{" "}
          <Code>package-lock.json</Code> from any local fetchit clone, then retry.
        </Li>
        <Li>
          <strong>Node.js version:</strong> fetchit requires Node.js 18 or newer. Check with{" "}
          <Code>node --version</Code>. Consider using{" "}
          <Link href="https://github.com/nvm-sh/nvm">nvm</Link> or{" "}
          <Link href="https://github.com/coreybutler/nvm-windows">nvm-windows</Link> to
          manage versions.
        </Li>
      </Ul>

      <H3>Binary not found after install</H3>
      <P>
        After installing, running <Code>fetchit</Code> gives <Code>command not found</Code> (Unix)
        or <Code>&apos;fetchit&apos; is not recognized</Code> (Windows).
      </P>
      <Ul>
        <Li>
          <strong>npm global bin not in PATH:</strong> Find where npm installs global binaries and
          add it to your PATH.
          <Pre>{`# Find the global bin directory
npm bin -g
# Typically:
#   Linux: ~/.npm-global/bin or /usr/local/bin
#   macOS: /usr/local/bin or ~/.npm-packages/bin
#   Windows: %APPDATA%\npm`}</Pre>
        </Li>
        <Li>
          <strong>Windows (PowerShell):</strong> You may need to restart your terminal or reload
          your profile: <Code>powershell -ExecutionPolicy RemoteScope &amp; $PROFILE</Code>
        </Li>
        <Li>
          <strong>Windows (cmd.exe):</strong> Restart the command prompt or log out and back in.
        </Li>
        <Li>
          <strong>Try npx:</strong> As a temporary workaround, use{" "}
          <Code>npx fetchit</Code> which does not require a global install.
        </Li>
      </Ul>

      <H3>&quot;command not found: fetchit&quot;</H3>
      <P>
        This typically means the global npm binary directory is not in your <Code>PATH</Code>
        environment variable.
      </P>
      <P>To fix it permanently:</P>
      <Pre>{`# Add this to your ~/.bashrc, ~/.zshrc, or ~/.profile:
export PATH="$(npm bin -g):$PATH"`}</Pre>
      <P>Then reload: <Code>source ~/.zshrc</Code></P>
      <P>
        On Windows, npm&apos;s global bin is at{" "}
        <Code>%APPDATA%\npm</Code> — ensure it is listed in your <Code>PATH</Code> under
        System Environment Variables.
      </P>

      <H3>Install fails on Node.js 22+</H3>
      <Note>
        fetchit is tested on Node 18, 20, and 22. If you encounter install failures on Node 22,
        check that you have the latest npm (npm 10+) which ships with better Node 22 support.
      </Note>

      <H2>yt-dlp Errors</H2>
      <P>
        fetchit delegates all download logic to yt-dlp. Most download-related errors originate
        from yt-dlp itself. Below are the most common error classes and how to address them.
      </P>

      <H3>Update yt-dlp first</H3>
      <P>
        This cannot be overstated: the majority of yt-dlp errors are fixed simply by updating.
        YouTube and other sites change their structure frequently, and yt-dlp&apos;s extractors
        need regular updates to keep working.
      </P>
      <Pre>{`# Update yt-dlp via fetchit's bundled copy
fetchit update`}</Pre>
      <P>If you installed yt-dlp system-wide, update it directly:</P>
      <Pre>{`# pip (recommended for standalone installs)
pip install -U yt-dlp

# Homebrew (macOS)
brew upgrade yt-dlp

# Winget (Windows)
winget upgrade yt-dlp

# Scoop (Windows)
scoop update yt-dlp

# Chocolatey (Windows)
choco upgrade yt-dlp`}</Pre>
      <Blockquote>
        fetchit bundles its own yt-dlp copy. Running <Code>fetchit update</Code> updates this
        bundled copy, not the system yt-dlp. If you also have a system-wide yt-dlp, the two are
        independent.
      </Blockquote>

      <H3>yt-dlp update fails</H3>
      <P>
        If <Code>fetchit update</Code> itself fails, here are the likely causes:
      </P>
      <Ul>
        <Li>
          <strong>Network connectivity:</strong> yt-dlp&apos;s update downloads from GitHub
          Releases. If GitHub is blocked in your region, use a VPN or proxy.
        </Li>
        <Li>
          <strong>Permission denied:</strong> The bundled yt-dlp is in <Code>~/.fetchit/bin/</Code>.
          Ensure you have write permission to that directory.
        </Li>
        <Li>
          <strong>Manual update:</strong> Download the latest yt-dlp binary manually from{" "}
          <Link href="https://github.com/yt-dlp/yt-dlp/releases">yt-dlp releases</Link> and
          replace the file at <Code>~/.fetchit/bin/yt-dlp</Code> (or <Code>yt-dlp.exe</Code> on
          Windows).
        </Li>
        <Li>
          <strong>Checksum mismatch:</strong> If the downloaded binary is corrupted, run{" "}
          <Code>fetchit doctor</Code> to verify checksums, then retry the update.
        </Li>
      </Ul>

      <H3>&quot;Sign in to confirm you&apos;re not a bot&quot;</H3>
      <P>
        YouTube imposes rate limits on IP addresses that generate a high volume of requests.
        When triggered, YouTube returns a <Code>HTTP Error 429 (Too Many Requests)</Code> or
        the &quot;Sign in to confirm&quot; page.
      </P>

      <H4>Fix: Rotate your IP</H4>
      <Ul>
        <Li>
          <strong>Use a VPN</strong> — Connect to a different geographic region to get a clean IP.
          This works immediately.
        </Li>
        <Li>
          <strong>Mobile hotspot</strong> — Tethering through your phone gives you a carrier IP,
          which is almost never rate-limited.
        </Li>
        <Li>
          <strong>Restart your router</strong> — Many ISPs assign dynamic IPs; restarting may give
          you a new one.
        </Li>
        <Li>
          <strong>Wait 24–48 hours</strong> — YouTube&apos;s rate-limit flag on an IP resets
          automatically. If you cannot change your IP, waiting is the only reliable option.
        </Li>
      </Ul>

      <H4>Fix: Provide browser cookies</H4>
      <P>
        Passing authenticated cookies from a logged-in browser session often bypasses rate limits:
      </P>
      <Pre>{`fetchit --cookies-from-browser firefox https://youtube.com/watch?v=...`}</Pre>
      <P>
        From inside the TUI, press <Code>[B]</Code> on the error screen to pick a browser and
        retry automatically.
      </P>
      <Note>
        Use Firefox on Windows when extracting cookies. Chrome and Edge encrypt their cookies
        with platform-level keys that yt-dlp cannot always decrypt. Firefox stores cookies in
        plaintext (SQLite) and works reliably across all platforms.
      </Note>

      <H4>Prevention: Reduce request rate</H4>
      <P>
        If you download many videos in quick succession, consider adding a delay between requests.
        yt-dlp accepts a <Code>--sleep-interval</Code> option that fetchit passes through:
      </P>
      <Pre>{`fetchit --ytdl-args "--sleep-interval 30" https://youtube.com/playlist?list=...`}</Pre>
      <P>
        This inserts a 30-second pause between each video in a playlist, reducing the likelihood
        of triggering rate limits.
      </P>

      <H3>Private video errors</H3>
      <P>
        yt-dlp cannot download private or unlisted videos unless you provide authentication
        cookies from a YouTube account that has access to the video.
      </P>
      <Ul>
        <Li>
          Use <Code>--cookies-from-browser</Code> with a browser where you are logged into the
          YouTube account that has access.
        </Li>
        <Li>
          Alternatively, export cookies to a file with a browser extension and pass them:
          <Pre>{`fetchit --cookies cookies.txt https://youtube.com/watch?v=...`}</Pre>
        </Li>
        <Li>
          Note that even with cookies, some private videos may refuse download if the account
          does not have explicit download permission. This is a server-side restriction that
          yt-dlp cannot bypass.
        </Li>
      </Ul>

      <H3>Age-restricted content</H3>
      <P>
        YouTube requires age verification for certain content. Without authentication, yt-dlp
        returns an error indicating the video is age-restricted.
      </P>
      <Ul>
        <Li>The simplest fix is to pass cookies from a logged-in, age-verified account.</Li>
        <Li>
          If cookie passing does not work, your account may not have age verification set up.
          Complete YouTube&apos;s age verification process (usually requires ID upload or credit
          card).
        </Li>
        <Li>
          On the TUI error screen, press <Code>[B]</Code> to select a browser and retry with
          cookies.
        </Li>
      </Ul>

      <H3>Geo-blocked content</H3>
      <P>
        Some content is restricted to specific countries. If you see <Code>HTTP Error 403</Code>{" "}
        or <Code>Video unavailable</Code> with a geo-blocking message:
      </P>
      <Ul>
        <Li>
          <strong>Use a VPN</strong> in the allowed country. Ensure the VPN is active before
          starting the download.
        </Li>
        <Li>
          <strong>Use a proxy:</strong> <Code>fetchit --proxy http://proxy-server:8080 ...</Code>
        </Li>
        <Li>
          <strong>Cookies from a local account:</strong> If you have a YouTube account registered
          in the allowed country, pass cookies from that account.
        </Li>
        <Li>
          Some geo-blocking checks happen at the CDN level. yt-dlp&apos;s{" "}
          <Code>--geo-bypass</Code> flag attempts to work around these, but results vary:
          <Pre>{`fetchit --ytdl-args "--geo-bypass" https://...`}</Pre>
        </Li>
      </Ul>

      <H3>&quot;This video is unavailable&quot;</H3>
      <P>
        This generic message can mean several things:
      </P>
      <Ul>
        <Li>
          <strong>Video was deleted or made private</strong> — Verify the URL works in a browser.
        </Li>
        <Li>
          <strong>Content ID takedown</strong> — The video was blocked by a copyright claim.
          Cannot be downloaded.
        </Li>
        <Li>
          <strong>Regional restriction</strong> — Try a VPN in the video&apos;s expected region.
        </Li>
        <Li>
          <strong>Embedding disabled</strong> — Some videos block all third-party access.
          Cookies may help, but some cannot be downloaded at all.
        </Li>
        <Li>
          <strong>Transient YouTube error</strong> — Retry after a few minutes. YouTube sometimes
          serves temporary errors that resolve on their own.
        </Li>
      </Ul>

      <H3>&quot;Unsupported URL&quot; / No extractor found</H3>
      <P>
        yt-dlp supports hundreds of sites, but not every URL is recognized. If you see
        &quot;Unsupported URL&quot;:
      </P>
      <Ul>
        <Li>Verify the URL is correct and points to a supported site.</Li>
        <Li>
          Check the{" "}
          <Link href="https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md">
            list of supported sites
          </Link>.
        </Li>
        <Li>
          For sites that require login, try passing cookies. Some sites serve different content
          (or no content) to unauthenticated viewers.
        </Li>
        <Li>
          Update yt-dlp to the latest version — new sites and extractors are added regularly.
        </Li>
      </Ul>

      <H2>ffmpeg Errors</H2>
      <P>
        ffmpeg is required for two operations: merging separate video and audio streams into a
        single file (e.g., best quality YouTube downloads) and extracting audio (<Code>-x</Code>).
      </P>

      <H3>Missing ffmpeg</H3>
      <P>
        If yt-dlp downloads both video and audio streams but cannot merge them, you will see an
        error like <Code>ffmpeg not found</Code> or <Code>Merging formats is not possible</Code>.
      </P>
      <P>Install ffmpeg using your system package manager:</P>
      <Pre>{`# macOS (Homebrew)
brew install ffmpeg

# macOS (MacPorts)
sudo port install ffmpeg

# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# Fedora / RHEL
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg

# Windows (Winget)
winget install ffmpeg

# Windows (Scoop)
scoop install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# Windows (manual)
# Download from https://ffmpeg.org/download.html and add bin/ to your PATH`}</Pre>
      <Blockquote>
        After installing ffmpeg, restart your terminal and run <Code>fetchit doctor</Code> to
        verify it is detected. If you installed during an active session, the PATH may not have
        been refreshed.
      </Blockquote>

      <H3>&quot;Conversion failed!&quot;</H3>
      <P>
        ffmpeg can fail for many reasons. The error text from ffmpeg is usually printed above the
        <Code>Conversion failed!</Code> line. Common causes:
      </P>
      <Ul>
        <Li>
          <strong>Corrupt download:</strong> The video or audio stream was not downloaded
          correctly. Re-run the download — if the issue persists, a lower quality may be needed.
        </Li>
        <Li>
          <strong>Unsupported codec:</strong> Your ffmpeg build may not include the required
          codec. Reinstall ffmpeg with all codecs enabled (e.g., <Code>brew install ffmpeg</Code>
          without <Code>--without-libx264</Code>).
        </Li>
        <Li>
          <strong>Outdated ffmpeg:</strong> Update ffmpeg to the latest version. Older builds
          may lack support for newer codecs like AV1 or Opus.
        </Li>
        <Li>
          <strong>Disk space:</strong> ffmpeg needs temporary space when remuxing or transcoding.
          Ensure you have free disk space.
        </Li>
      </Ul>

      <H3>ffmpeg not found in PATH</H3>
      <P>
        Even after installing ffmpeg, yt-dlp may not find it. This happens when ffmpeg is
        installed but not in the system PATH, or the PATH has not been refreshed.
      </P>
      <Ul>
        <Li>
          Verify the installation: <Code>ffmpeg -version</Code> in a new terminal window.
        </Li>
        <Li>
          If the command is not found, locate the ffmpeg binary and add its directory to your
          PATH environment variable.
        </Li>
        <Li>
          On Windows, after installing via winget/scoop/choco, you may need to restart the
          terminal or reboot for PATH changes to take effect.
        </Li>
        <Li>
          As a workaround, you can pass the ffmpeg location directly to yt-dlp through fetchit:
          <Pre>{`fetchit --ytdl-args "--ffmpeg-location C:\\path\\to\\ffmpeg.exe" https://...`}</Pre>
        </Li>
      </Ul>

      <H3>ffmpeg merge fails with large files</H3>
      <P>
        When merging very large files (4K, 8K, long videos), ffmpeg may run out of memory or the
        file system may hit size limits:
      </P>
      <Ul>
        <Li>
          Use a lower-quality format that does not require merging (e.g., download only the video
          stream and skip audio).
        </Li>
        <Li>
          Ensure the download drive has enough free space — ffmpeg needs roughly 2x the final
          file size for the merge operation.
        </Li>
        <Li>
          On Windows, ensure the file system is NTFS (FAT32 has a 4 GB file size limit). Run
          <Code>fsutil fsinfo volumeinfo C:</Code> to check.
        </Li>
      </Ul>

      <H3>Audio extraction fails</H3>
      <P>
        When using <Code>fetchit -x</Code> to extract audio, ffmpeg handles the conversion.
        Failures are often due to missing audio codecs in your ffmpeg build.
      </P>
      <Ul>
        <Li>Ensure ffmpeg is compiled with <Code>--enable-libmp3lame</Code> for MP3 output.</Li>
        <Li>For AAC output, ensure <Code>--enable-libfdk-aac</Code> or use the built-in AAC encoder.</Li>
        <Li>Try a different output format: <Code>--audio-format</Code> can be <Code>mp3</Code>, <Code>aac</Code>, <Code>flac</Code>, <Code>opus</Code>, or <Code>vorbis</Code>.</Li>
      </Ul>

      <H2>Download Errors</H2>

      <H3>Network timeouts</H3>
      <P>
        If a download stalls or fails with a timeout error (<Code>Connection timed out</Code>,{" "}
        <Code>Read timed out</Code>):
      </P>
      <Ul>
        <Li>
          <strong>Check your internet connection.</strong> Run <Code>ping google.com</Code> to
          verify basic connectivity.
        </Li>
        <Li>
          <strong>YouTube server load:</strong> YouTube may be slow in your region. Try a VPN or
          proxy.
        </Li>
        <Li>
          <strong>Retry with increased timeout:</strong> yt-dlp accepts a socket timeout
          parameter:
          <Pre>{`fetchit --ytdl-args "--socket-timeout 60" https://...`}</Pre>
        </Li>
        <Li>
          <strong>Firewall / corporate proxy:</strong> Some networks block or throttle video
          streaming. Try on a different network to isolate the issue.
        </Li>
        <Li>
          <strong>Fragment downloads:</strong> For very large files, yt-dlp downloads in
          fragments. A single fragment timeout can abort the whole download. Increase the
          retry count:
          <Pre>{`fetchit --ytdl-args "--retries 10 --fragment-retries 10" https://...`}</Pre>
        </Li>
      </Ul>

      <H3>Connection refused</H3>
      <P>
        <Code>Connection refused</Code> means the remote server actively rejected the connection.
        This is usually a network-level issue:
      </P>
      <Ul>
        <Li>
          <strong>YouTube is blocked in your region/country.</strong> Use a VPN to a country
          where YouTube is accessible.
        </Li>
        <Li>
          <strong>Corporate firewall</strong> is blocking the connection. Check with your IT
          department or try on a personal network.
        </Li>
        <Li>
          <strong>DNS resolution failure:</strong> Try using a different DNS server:
          <Pre>{`# Use Cloudflare DNS
fetchit --ytdl-args "--source-address 1.1.1.1" https://...`}</Pre>
        </Li>
        <Li>
          <strong>IPv6 issues:</strong> Some networks have broken IPv6. Force IPv4:
          <Pre>{`fetchit --ytdl-args "--force-ipv4" https://...`}</Pre>
        </Li>
      </Ul>

      <H3>SSL certificate errors</H3>
      <P>
        SSL errors (<Code>SSL: CERTIFICATE_VERIFY_FAILED</Code>) indicate that Python/yt-dlp
        cannot verify the certificate presented by YouTube&apos;s servers.
      </P>
      <Ul>
        <Li>
          <strong>Outdated system certificates:</strong> Update your operating system&apos;s CA
          certificates:
          <Pre>{`# macOS
brew install ca-certificates

# Ubuntu / Debian
sudo apt update && sudo apt install ca-certificates

# Windows
# Run Windows Update to install latest root certificates`}</Pre>
        </Li>
        <Li>
          <strong>Corporate proxy / MITM:</strong> If your organization uses SSL inspection, you
          may need to configure yt-dlp to use the corporate CA certificate:
          <Pre>{`fetchit --ytdl-args "--ssl-certificate C:\\path\\to\\corp-ca.crt" https://...`}</Pre>
        </Li>
        <Li>
          <strong>Date/time incorrect:</strong> SSL certificates rely on accurate system time.
          Ensure your system clock is synchronized:
          <Pre>{`# macOS
sudo sntp -sS time.apple.com

# Linux
sudo ntpdate -s time.nist.gov

# Windows
w32tm /resync /force`}</Pre>
        </Li>
        <Li>
          <strong>Workaround — disable SSL verification (not recommended):</strong>
          <Pre>{`fetchit --ytdl-args "--no-check-certificate" https://...`}</Pre>
          <Note>
            Disabling certificate verification is a security risk and should only be used as a
            temporary diagnostic measure. Re-enable it as soon as the underlying issue is resolved.
          </Note>
        </Li>
      </Ul>

      <H3>Disk full / no space left</H3>
      <P>
        <Code>No space left on device</Code> (Unix) or <Code>Not enough disk space</Code> (Windows)
        is straightforward: the download drive has run out of space.
      </P>
      <Ul>
        <Li>
          Check available space: <Code>df -h</Code> (Unix) or <Code>Get-PSDrive C</Code> (PowerShell).
        </Li>
        <Li>Free up space by deleting temporary files, old downloads, or clearing the recycle bin.</Li>
        <Li>Change the download directory to a drive with more space:</Li>
      </Ul>
      <Pre>{`fetchit --output-dir D:\\downloads https://...`}</Pre>
      <P>
        yt-dlp also downloads video and audio separately before merging, which requires roughly
        2x the final file size in temporary space. Ensure you have enough headroom.
      </P>

      <H3>Permission denied (file write)</H3>
      <P>
        <Code>Permission denied</Code> when writing the output file means fetchit does not have
        write permission on the target directory.
      </P>
      <Ul>
        <Li>
          <strong>Output directory does not exist:</strong> yt-dlp does not create intermediate
          directories. Ensure the output directory exists:
          <Pre>{`mkdir -p ~/downloads/videos
fetchit --output-dir ~/downloads/videos https://...`}</Pre>
        </Li>
        <Li>
          <strong>Read-only filesystem:</strong> Check if the target drive or directory is
          read-only.
        </Li>
        <Li>
          <strong>macOS:</strong> If downloading to an external drive, ensure it is not formatted
          as NTFS (macOS cannot write to NTFS without third-party tools).
        </Li>
        <Li>
          <strong>Linux:</strong> Check directory permissions with <Code>ls -ld /path/to/dir</Code>.
          The user running fetchit must have write permission.
        </Li>
        <Li>
          <strong>Windows:</strong> Run as administrator if downloading to protected locations
          like <Code>C:\Program Files</Code>.
        </Li>
      </Ul>

      <H3>File name too long (Windows)</H3>
      <P>
        Windows has a 260-character path limit by default. Videos with long titles can produce
        file paths that exceed this limit.
      </P>
      <Ul>
        <Li>
          <strong>Enable long path support (Windows 10/11):</strong>
          <Pre>{`# In PowerShell (as Administrator)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`}</Pre>
          Then restart fetchit. Note that long paths must also be enabled in Group Policy or the
          application must be manifested to support them (fetchit is).
        </Li>
        <Li>
          <strong>Use a shorter output template:</strong>
          <Pre>{`fetchit --output "%(id)s.%(ext)s" https://...`}</Pre>
          This uses the video ID instead of the full title.
        </Li>
        <Li>
          <strong>Download to a short path:</strong> Use <Code>C:\dl</Code> instead of a deeply
          nested folder.
        </Li>
        <Li>
          <strong>Custom output template:</strong> Truncate the title:
          <Pre>{`fetchit --output "%(title).100B.%(ext)s" https://...`}</Pre>
          This limits the title to 100 characters.
        </Li>
      </Ul>

      <H3>Download is slow</H3>
      <Ul>
        <Li>Higher quality = larger files. Try a lower resolution or use <Code>-f best[height&lt;=720]</Code>.</Li>
        <Li>YouTube rate-limits download speed for unauthenticated clients. Using cookies from a premium account can sometimes improve speed.</Li>
        <Li>Network congestion — try downloading at a different time of day.</Li>
        <Li>Use a wired connection instead of Wi-Fi for more stable throughput.</Li>
        <Li>If downloading from a site other than YouTube, the source server may have bandwidth limits.</Li>
      </Ul>

      <H3>Resuming interrupted downloads</H3>
      <P>
        yt-dlp supports resuming partial downloads for most sites. If a download is interrupted:
      </P>
      <Pre>{`# Simply re-run the same command — yt-dlp detects partial files and resumes
fetchit https://youtube.com/watch?v=...`}</Pre>
      <P>
        If resuming does not work (e.g., the partial file was deleted or the URL has expired),
        delete the partial file (ending in <Code>.part</Code>, <Code>.ytdl</Code>, or similar)
        and start fresh.
      </P>

      <H2>Platform-Specific Issues</H2>

      <H3>Windows</H3>

      <H4>Windows SmartScreen / Windows Defender</H4>
      <P>
        When fetchit downloads the yt-dlp binary, Windows SmartScreen or Windows Defender may
        flag it as suspicious. This is a false positive — yt-dlp is legitimate open-source software.
      </P>
      <Ul>
        <Li>
          If SmartScreen blocks the download, click <Code>More info</Code> then{" "}
          <Code>Run anyway</Code>.
        </Li>
        <Li>
          If Defender quarantines the binary, restore it from quarantine and add an exclusion:
          <Pre>{`# Add exclusion for fetchit's binary directory
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.fetchit\bin"`}</Pre>
        </Li>
        <Li>
          You can also manually download the yt-dlp executable from{" "}
          <Link href="https://github.com/yt-dlp/yt-dlp/releases">GitHub Releases</Link> and
          place it in <Code>%USERPROFILE%\.fetchit\bin\yt-dlp.exe</Code>.
        </Li>
      </Ul>

      <H4>EPERM: operation not permitted</H4>
      <P>
        This error usually means Windows Defender is scanning the yt-dlp binary while fetchit is
        trying to execute it. The scan holds a file lock.
      </P>
      <Ul>
        <Li>
          Wait a few seconds and retry — the scan is usually transient.
        </Li>
        <Li>
          Kill any stuck processes: <Code>taskkill /F /IM yt-dlp.exe</Code> from an Administrator
          prompt.
        </Li>
        <Li>
          Add <Code>~/.fetchit/bin</Code> to Windows Defender exclusions (see above).
        </Li>
        <Li>
          As a last resort, temporarily disable real-time protection (not recommended for long-term use).
        </Li>
      </Ul>

      <H4>PowerShell execution policy</H4>
      <P>
        If you installed fetchit via npm and run it from PowerShell, you may encounter:
        <Code>... cannot be loaded because running scripts is disabled on this system</Code>.
      </P>
      <P>This is a PowerShell execution policy restriction, not a fetchit issue:</P>
      <Pre>{`# Check current policy
Get-ExecutionPolicy

# Set to RemoteSigned (allows local scripts, requires remote scripts to be signed)
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`}</Pre>
      <Note>
        Changing execution policy requires Administrator privileges unless you use{" "}
        <Code>-Scope CurrentUser</Code>. Using npx to run fetchit avoids this issue entirely.
      </Note>

      <H4>Long path support (Windows 10/11)</H4>
      <P>
        As described in the download errors section, Windows has a 260-character MAX_PATH
        limitation. Videos with long titles can easily exceed this.
      </P>
      <P>
        Enable long path support system-wide:
      </P>
      <Pre>{`# Registry method (requires reboot)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f`}</Pre>
      <P>
        Or use a short output template as a per-command workaround.
      </P>

      <H4>Terminal encoding / Unicode issues</H4>
      <P>
        Some video titles contain Unicode characters that may display incorrectly in the Windows
        terminal. Set the terminal to UTF-8:
      </P>
      <Pre>{`# PowerShell
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.UTF8Encoding]::new()

# cmd.exe
chcp 65001`}</Pre>

      <H3>macOS</H3>

      <H4>Gatekeeper / &quot;App is damaged and can&apos;t be opened&quot;</H4>
      <P>
        macOS Gatekeeper may block the yt-dlp binary because it is not notarized by Apple. This
        is expected — yt-dlp is open-source software and does not go through Apple&apos;s notarization
        process.
      </P>
      <Ul>
        <Li>
          To run it anyway, remove the quarantine attribute:
          <Pre>{`xattr -d com.apple.quarantine ~/.fetchit/bin/yt-dlp`}</Pre>
        </Li>
        <Li>
          If you still see Gatekeeper warnings, go to <Code>System Settings → Privacy &amp; Security</Code>{" "}
          and click <Code>Open Anyway</Code> next to the blocked message.
        </Li>
      </Ul>

      <H4>Quarantine attributes on downloaded files</H4>
      <P>
        macOS automatically sets the <Code>com.apple.quarantine</Code> extended attribute on files
        downloaded from the internet. This can cause issues when fetchit tries to execute the
        yt-dlp binary.
      </P>
      <P>
        Run fetchit&apos;s built-in fix:
      </P>
      <Pre>{`fetchit doctor

# Or manually strip the attribute:
xattr -rd com.apple.quarantine ~/.fetchit/`}</Pre>

      <H4>&quot;Operation not permitted&quot; (macOS sandboxing)</H4>
      <P>
        macOS 10.15+ has strict sandboxing. If fetchit cannot access certain directories (Desktop,
        Documents, Downloads), you may need to grant permissions:
      </P>
      <Ul>
        <Li>
          Go to <Code>System Settings → Privacy &amp; Security → Files and Folders</Code>.
        </Li>
        <Li>Ensure your terminal app has permission to access the download directory.</Li>
        <Li>Alternatively, download to a directory outside the protected areas, such as <Code>~/Videos</Code> or <Code>~/Downloads/fetchit</Code>.</Li>
      </Ul>

      <H4>ffmpeg not found on Apple Silicon (M1/M2/M3)</H4>
      <P>
        If you installed ffmpeg via Homebrew on Apple Silicon, it is installed under{" "}
        <Code>/opt/homebrew/bin/ffmpeg</Code>, which may not be in your PATH if you are using a
        shell that does not source the Homebrew environment.
      </P>
      <Pre>{`# Add this to ~/.zshrc or ~/.bash_profile:
eval "$(/opt/homebrew/bin/brew shellenv)"`}</Pre>

      <H3>Linux</H3>

      <H4>Missing shared libraries</H4>
      <P>
        The yt-dlp binary is a standalone Python executable, but it may depend on certain shared
        libraries. If you see errors about missing <Code>.so</Code> files:
      </P>
      <Pre>{`# Ubuntu / Debian
sudo apt install python3 python3-pip

# Fedora / RHEL
sudo dnf install python3 python3-pip

# Arch Linux
sudo pacman -S python python-pip`}</Pre>

      <H4>glibc compatibility</H4>
      <P>
        yt-dlp&apos;s binary builds have a minimum glibc version requirement. If you are running
        a very old Linux distribution (e.g., CentOS 7, Ubuntu 18.04), the bundled yt-dlp may not
        work.
      </P>
      <Ul>
        <Li>
          Check your glibc version: <Code>ldd --version | head -1</Code>
        </Li>
        <Li>
          If your glibc is too old, install yt-dlp via pip instead of using the bundled binary:
          <Pre>{`pip install yt-dlp
# Then ensure pip-installed yt-dlp is found first in PATH`}</Pre>
        </Li>
        <Li>
          Or use the <Code>yt-dlp_linux</Code> standalone binary which has broader compatibility.
        </Li>
      </Ul>

      <H4>Snap / Flatpak conflicts</H4>
      <P>
        If you installed fetchit via npm but also have a snap or flatpak version of yt-dlp on
        your system, there may be conflicts.
      </P>
      <Ul>
        <Li>
          fetchit bundles its own yt-dlp in <Code>~/.fetchit/bin/</Code> and should use it
          regardless of system packages.
        </Li>
        <Li>
          If you suspect fetchit is picking up the wrong yt-dlp, run:
          <Pre>{`fetchit --verbose https://... | grep "yt-dlp path"`}</Pre>
          This will show which yt-dlp binary is being used.
        </Li>
        <Li>
          Snap packages are sandboxed and may not have access to <Code>~/.fetchit/bin/</Code>.
          If you installed fetchit as a snap, consider using the npm install instead.
        </Li>
      </Ul>

      <H4>Clipboard detection doesn&apos;t work (Linux)</H4>
      <Ul>
        <Li>
          Clipboard monitoring only works when stdout is a terminal (not in scripts or piped
          commands).
        </Li>
        <Li>
          Install a clipboard tool:
          <Pre>{`# X11 (Xorg)
sudo apt install xclip

# Wayland
sudo apt install wl-clipboard`}</Pre>
        </Li>
      </Ul>

      <H2>Network and Proxy Configuration</H2>

      <H3>Using a proxy</H3>
      <P>
        fetchit passes the proxy setting directly to yt-dlp. You can configure a proxy for all
        requests:
      </P>
      <Pre>{`fetchit --proxy http://127.0.0.1:8080 https://...
fetchit --proxy socks5://127.0.0.1:1080 https://...`}</Pre>
      <P>
        Supported proxy types: HTTP, HTTPS, SOCKS4, SOCKS5.
      </P>

      <H3>Environment variables</H3>
      <P>
        yt-dlp respects standard proxy environment variables. Set these if you use a system-wide
        proxy:
      </P>
      <Pre>{`export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.internal.company.com

# Or set them per-command:
HTTP_PROXY=http://proxy:8080 fetchit https://...`}</Pre>

      <H3>Proxy authentication</H3>
      <P>
        If your proxy requires authentication, include credentials in the URL:
      </P>
      <Pre>{`fetchit --proxy http://username:password@proxy:8080 https://...`}</Pre>
      <Note>
        Passing credentials in the URL may leak them in process listings. Consider using
        environment variables or a .netrc file instead.
      </Note>

      <H3>Corporate NTLM proxy</H3>
      <P>
        NTLM-authenticated proxies (common in corporate environments) require special handling.
        yt-dlp does not support NTLM directly. Use a local proxy relay like{" "}
        <Link href="https://ntlmproxy.sourceforge.net/">NTLM Authorization Proxy Server</Link>{" "}
        or <Link href="https://cntlm.sourceforge.net/">Cntlm</Link> to bridge NTLM to a standard
        HTTP proxy.
      </P>

      <H3>DNS over HTTPS</H3>
      <P>
        If you are experiencing DNS-based blocking, yt-dlp can be configured to use DNS over
        HTTPS:
      </P>
      <Pre>{`fetchit --ytdl-args "--dns-cache-disabled --dns-address 1.1.1.1" https://...`}</Pre>

      <H2>Known Issues and Workarounds</H2>

      <H3>TUI does not render correctly</H3>
      <P>
        The terminal UI requires a terminal that supports ANSI escape codes and Unicode. If the
        display is garbled:
      </P>
      <Ul>
        <Li>
          <strong>Windows:</strong> Use Windows Terminal (not cmd.exe or the legacy PowerShell
          ISE). Ensure Virtual Terminal Processing is enabled (it is by default in Windows Terminal).
        </Li>
        <Li>
          <strong>tmux/screen users:</strong> Ensure your <Code>$TERM</Code> is set correctly
          (e.g., <Code>tmux-256color</Code> or <Code>screen-256color</Code>).
        </Li>
        <Li>
          <strong>SSH:</strong> Ensure your SSH client supports UTF-8 and 256-color terminals.
          Use <Code>ssh -o SendEnv=LANG=en_US.UTF-8</Code>.
        </Li>
        <Li>
          <strong>Fallback to CLI mode:</strong> If the TUI is unusable, use the non-interactive
          CLI mode:
          <Pre>{`fetchit --no-tui https://...`}</Pre>
        </Li>
      </Ul>

      <H3>Playlist downloads are slow</H3>
      <P>
        Large playlists can take time because yt-dlp fetches metadata for each video sequentially
        before downloading.
      </P>
      <Ul>
        <Li>
          Use <Code>--playlist-start</Code> and <Code>--playlist-end</Code> to limit the range:
          <Pre>{`fetchit --playlist-start 1 --playlist-end 10 https://youtube.com/playlist?list=...`}</Pre>
        </Li>
        <Li>
          Use <Code>--flat-playlist</Code> to skip metadata extraction for non-downloaded videos:
          <Pre>{`fetchit --ytdl-args "--flat-playlist" https://youtube.com/playlist?list=...`}</Pre>
        </Li>
        <Li>
          Download only specific videos by index: <Code>--playlist-items 1,3,5-7</Code>
        </Li>
      </Ul>

      <H3>&quot;HTTP Error 403: Forbidden&quot;</H3>
      <P>
        A 403 error can mean several things. Try these in order:
      </P>
      <Ol>
        <Li>Update yt-dlp (<Code>fetchit update</Code>)</Li>
        <Li>Pass cookies from a logged-in browser</Li>
        <Li>Use a VPN or proxy (geo-blocking)</Li>
        <Li>Try a different video to confirm it is not video-specific</Li>
      </Ol>

      <H3>Downloaded file has no audio or no video</H3>
      <P>
        YouTube serves video and audio as separate streams. If you end up with a file that has
        only video or only audio:
      </P>
      <Ul>
        <Li>
          yt-dlp automatically merges them if ffmpeg is installed. If not, you will get two
          separate files or a file missing one stream.
        </Li>
        <Li>Install ffmpeg (see ffmpeg section above) and retry.</Li>
        <Li>
          Alternatively, use <Code>-f bestvideo+bestaudio</Code> which forces yt-dlp to download
          and merge both streams.
        </Li>
      </Ul>

      <H3>Config file not being read</H3>
      <P>
        fetchit reads configuration from:
      </P>
      <Ul>
        <Li><Code>~/.fetchit/config.json</Code> (user config)</Li>
        <Li><Code>.fetchitrc</Code> in the current directory (project config)</Li>
        <Li>Environment variables prefixed with <Code>FETCHIT_</Code></Li>
        <Li>CLI flags (highest priority)</Li>
      </Ul>
      <P>
        If your config file is not being applied, verify the file location and format:
      </P>
      <Pre>{`cat ~/.fetchit/config.json
# Should contain valid JSON, e.g.:
# {
#   "outputDir": "~/downloads",
#   "defaultQuality": "best"
# }`}</Pre>

      <H2>Getting Support</H2>

      <H3>GitHub Issues</H3>
      <P>
        If you have tried the solutions above and still need help, please{" "}
        <Link href="https://github.com/Vedant1521/fetchit/issues/new">open a new GitHub issue</Link>.
        To help us diagnose the problem quickly, include the following:
      </P>

      <H4>Bug report template</H4>
      <Pre>{`## Description
[Clear description of the problem]

## Steps to Reproduce
1. The exact command you ran
2. Expected behavior
3. Actual behavior

## Environment
- OS: [e.g., Windows 11, macOS 14.5, Ubuntu 24.04]
- fetchit version: [fetchit --version]
- Node.js version: [node --version]
- npm version: [npm --version]
- yt-dlp version: [the output from the verbose log]
- ffmpeg version: [ffmpeg -version, if installed]

## Verbose Output
[Run the command with --verbose and paste the FULL output here]

## Additional Context
- Are you behind a proxy/VPN?
- Is this a new issue or has it always happened?
- Does it affect all videos or just one?
- Screenshots, if applicable`}</Pre>

      <H3>What to include</H3>
      <Ul>
        <Li>
          <strong>Always include verbose output.</strong> Run the failing command with{" "}
          <Code>--verbose</Code> and paste the full output. This is the single most helpful
          piece of information.
        </Li>
        <Li>
          <strong>The exact URL</strong> you are trying to download (you can obfuscate personal
          identifiers if needed, but keep the video ID intact).
        </Li>
        <Li>
          <strong>Your operating system and versions</strong> of fetchit, Node.js, npm, yt-dlp,
          and ffmpeg.
        </Li>
        <Li>
          <strong>Any proxy or VPN</strong> you are using — corporate proxies are a common source
          of issues.
        </Li>
        <Li>
          <strong>What you already tried</strong> — this helps us avoid suggesting things that
          did not work.
        </Li>
      </Ul>

      <H3>Before opening an issue</H3>
      <Ol>
        <Li>
          <strong>Search existing issues</strong> — your problem may already have a fix or
          workaround.
        </Li>
        <Li>
          <strong>Update everything</strong> — run <Code>fetchit update</Code>, update yt-dlp,
          and update ffmpeg.
        </Li>
        <Li>
          <strong>Test with a different video</strong> to rule out video-specific issues.
        </Li>
        <Li>
          <strong>Test with a different network</strong> (e.g., mobile hotspot) to rule out
          network issues.
        </Li>
        <Li>
          <strong>Run <Code>fetchit doctor</Code></strong> and include its output in your report.
        </Li>
      </Ol>

      <H3>Community support</H3>
      <P>
        In addition to GitHub Issues, you can also:
      </P>
      <Ul>
        <Li>
          Check the{" "}
          <Link href="https://github.com/yt-dlp/yt-dlp/discussions">yt-dlp discussions</Link>{" "}
          for download-specific questions (many issues are actually yt-dlp issues, not fetchit
          issues).
        </Li>
        <Li>
          Review the{" "}
          <Link href="https://github.com/Vedant1521/fetchit/discussions">fetchit discussions</Link>{" "}
          for usage questions and tips.
        </Li>
        <Li>
          See the{" "}
          <Link href="https://github.com/yt-dlp/yt-dlp/wiki/FAQ">yt-dlp FAQ</Link> for
          frequently asked questions about the underlying download engine.
        </Li>
      </Ul>
    </Prose>
  )
}
