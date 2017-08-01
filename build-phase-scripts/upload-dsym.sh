#!/bin/bash

# Get path for sentry-cli 

# Setup nvm and set node

[ -z "$NVM_DIR" ] && export NVM_DIR="$HOME/.nvm"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  . "$HOME/.nvm/nvm.sh"
elif [[ -x "$(command -v brew)" && -s "$(brew --prefix nvm)/nvm.sh" ]]; then
  . "$(brew --prefix nvm)/nvm.sh"
fi

# Set up the nodenv node version manager if present
if [[ -x "$HOME/.nodenv/bin/nodenv" ]]; then
  eval "$("$HOME/.nodenv/bin/nodenv" init -)"
fi

[ -z "$NODE_BINARY" ] && export NODE_BINARY="node"

nodejs_not_found()
{
  echo "error: Can't find '$NODE_BINARY' binary to build Upload symbols" >&2
  exit 2
}

type $NODE_BINARY >/dev/null 2>&1 || nodejs_not_found

# Run sentry cli script to upload debug symbols
$NODE_BINARY ../node_modules/sentry-cli-binary/bin/sentry-cli upload-dsym
