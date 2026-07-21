#!/bin/sh
# fetchit installer
#   curl -fsSL https://fetchit-cli.vercel.app/install.sh | sh
set -eu

REPO="vedant1521/fetchit"
BINARY_DIR="${HOME}/.fetchit/bin"
YTDLP_DIR="${HOME}/.fetchit/bin"

has_command() {
  command -v "$1" >/dev/null 2>&1
}

echo() {
  printf '%s\n' "$*"
}

install_via_npm() {
  echo "✓ Node.js $(node --version) found"
  if npm install -g "@${REPO}"; then
    echo "✓ fetchit installed via npm"
    echo "  Run 'fetchit' to start."
    return 0
  else
    echo "! npm install failed, will try standalone binary..."
    return 1
  fi
}

install_standalone_binary() {
  os="$1"
  arch="$2"

  case "${os}" in
    linux)   os_label="linux" ;;
    darwin)  os_label="darwin" ;;
    *)       return 1 ;;
  esac

  case "${arch}" in
    x86_64|amd64) arch_label="x64" ;;
    aarch64|arm64) arch_label="arm64" ;;
    *)            return 1 ;;
  esac

  asset="fetchit-${os_label}-${arch_label}"
  if [ "${os_label}" = "linux" ]; then
    archive_url="https://github.com/${REPO}/releases/latest/download/${asset}.tar.gz"
  else
    archive_url="https://github.com/${REPO}/releases/latest/download/${asset}.tar.gz"
  fi

  mkdir -p "${BINARY_DIR}"

  echo "↓ Downloading fetchit for ${os_label}/${arch_label}..."

  if has_command curl; then
    curl -fsSL "${archive_url}" -o "${BINARY_DIR}/fetchit.tar.gz" 2>/dev/null || return 1
  elif has_command wget; then
    wget -q "${archive_url}" -O "${BINARY_DIR}/fetchit.tar.gz" 2>/dev/null || return 1
  else
    return 1
  fi

  tar -xzf "${BINARY_DIR}/fetchit.tar.gz" -C "${BINARY_DIR}" 2>/dev/null || return 1
  rm -f "${BINARY_DIR}/fetchit.tar.gz"
  chmod +x "${BINARY_DIR}/fetchit"

  echo "✓ fetchit installed to ${BINARY_DIR}/fetchit"
}

setup_path() {
  shell_rc=""
  case "${SHELL:-}" in
    */zsh) shell_rc="${HOME}/.zshrc" ;;
    */bash) shell_rc="${HOME}/.bashrc" ;;
    */fish) shell_rc="${HOME}/.config/fish/config.fish" ;;
  esac

  case "${SHELL:-}" in
    */fish)
      fish_cmd="fish_add_path ${BINARY_DIR}"
      if ! eval "${fish_cmd}" >/dev/null 2>&1; then
        echo "set -U fish_user_paths ${BINARY_DIR} \$fish_user_paths" >> "${shell_rc}"
      fi
      ;;
    *)
      if [ -n "${shell_rc}" ]; then
        line="export PATH=\"\${PATH}:${BINARY_DIR}\""
        if ! grep -qF "${BINARY_DIR}" "${shell_rc}" 2>/dev/null; then
          echo "" >> "${shell_rc}"
          echo "# fetchit" >> "${shell_rc}"
          echo "${line}" >> "${shell_rc}"
        fi
      fi
      ;;
  esac

  echo "  Added ${BINARY_DIR} to PATH in ${shell_rc:-"your shell config"}"
  echo "  Restart your terminal or run: export PATH=\"\$PATH:${BINARY_DIR}\""
}

download_ytdlp() {
  mkdir -p "${YTDLP_DIR}"

  echo "↓ Downloading yt-dlp..."

  case "$(uname -s)" in
    Linux)
      url="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux"
      if [ "$(uname -m)" = "aarch64" ]; then
        url="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_aarch64"
      fi
      dest="${YTDLP_DIR}/yt-dlp"
      ;;
    Darwin)
      url="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
      dest="${YTDLP_DIR}/yt-dlp"
      ;;
    *)
      return 0
      ;;
  esac

  if has_command curl; then
    curl -fsSL "${url}" -o "${dest}"
  elif has_command wget; then
    wget -q "${url}" -O "${dest}"
  else
    echo "! Warning: could not download yt-dlp (no curl or wget)"
    echo "  fetchit will download it on first run instead."
    return 0
  fi

  chmod +x "${dest}"
  echo "✓ yt-dlp downloaded to ${dest}"
}

# --- main ---

os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m | tr '[:upper:]' '[:lower:]')"

echo "  fetchit installer"
echo "  ${os}/${arch}"
echo ""

# Prefer npm if Node.js is available
if has_command node; then
  ver="$(node --version | sed 's/v//' | cut -d. -f1)"
  if [ "${ver}" -ge 18 ] 2>/dev/null; then
    if install_via_npm; then
      download_ytdlp
      echo ""
      echo "✓ Setup complete. Run 'fetchit' to start."
      exit 0
    fi
  fi
fi

# Try standalone binary
echo "  Node.js 18+ not found. Trying standalone binary..."
echo ""

if install_standalone_binary "${os}" "${arch}"; then
  download_ytdlp
  setup_path
  echo ""
  echo "✓ Setup complete. Restart your terminal and run 'fetchit'."
  exit 0
fi

# Fallback: guide user
echo "! Could not install fetchit automatically."
echo ""
echo "  Option 1 — Install Node.js 18+ and rerun this script:"
case "${os}" in
  linux)
    echo "    curl -fsSL https://deb.nodesource.com/setup_22.x | sh"
    echo "    apt install nodejs"
    ;;
  darwin)
    echo "    brew install node"
    ;;
esac
echo ""
echo "  Option 2 — Download the latest release manually:"
echo "    https://github.com/${REPO}/releases"
echo ""
exit 1
