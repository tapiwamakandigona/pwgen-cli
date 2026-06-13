# pwgen-cli

A secure, zero-dependency password generator CLI built with Node.js and TypeScript. Uses `crypto.randomBytes` for cryptographically secure random generation.

## Features

- Cryptographically secure random password generation via Node.js `crypto` module
- Customizable password length and batch generation
- Toggle character classes (uppercase, symbols)
- Exclude specific characters
- Entropy estimation displayed with each password
- Cross-platform binaries via CI/CD release pipeline

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js 20+
- **Build:** `tsc` (TypeScript compiler)
- **CI/CD:** GitHub Actions (build + multi-platform release via `@yao-pkg/pkg`)

## Installation

### From source

```bash
git clone https://github.com/tapiwamakandigona/pwgen-cli.git
cd pwgen-cli
npm install
npm run build
node dist/index.js
```

### Global install (development)

```bash
npm install
npm run build
npm link
pwgen
```

## Usage

```bash
# Generate a single 16-character password (default)
pwgen

# Generate a 32-character password
pwgen -l 32

# Generate 5 passwords at once
pwgen -c 5

# Exclude uppercase letters
pwgen --no-uppercase

# Exclude symbols
pwgen --no-symbols

# Exclude specific characters (e.g., ambiguous characters)
pwgen --exclude "0O1lI"

# Combine options
pwgen -l 24 -c 3 --no-symbols --exclude "0O1lI"

# Show help
pwgen --help
```

### Output

Each generated password is printed with its estimated entropy:

```
Yg&9_A$&H*G)WKSj  (105 bits)
```

## CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `-l, --length N` | Password length | `16` |
| `-c, --count N` | Number of passwords to generate | `1` |
| `--no-uppercase` | Exclude uppercase letters | off |
| `--no-symbols` | Exclude symbol characters | off |
| `--exclude CHARS` | Exclude specific characters | none |
| `-h, --help` | Show help message | — |

## Project Structure

```
pwgen-cli/
├── src/
│   └── index.ts        # Main CLI entry point and password logic
├── dist/               # Compiled JavaScript output (gitignored)
├── .github/
│   ├── workflows/
│   │   ├── ci.yml      # Build + test on push/PR
│   │   └── release.yml # Multi-platform binary release on tags
│   └── dependabot.yml  # Automated dependency updates
├── tsconfig.json       # TypeScript configuration
├── package.json
├── CHANGELOG.md
└── LICENSE             # MIT
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run directly
node dist/index.js [options]
```

## License

MIT — see [LICENSE](LICENSE) for details.
