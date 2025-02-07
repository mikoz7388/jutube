#!/bin/bash
set -e

echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash

export PATH="$HOME/.bun/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

echo "Installing dependencies with Bun..."
bun install

echo "Building Next.js app..."
bun run build
