#!/usr/bin/env bash
set -e # halt script on error

echo 'Testing travis...'
mkdir dist
npm run build

## config
echo "Git config"
git config --global user.email "guiseek@gmail.com"
git config --global user.name "Travis CI"

# deploy
echo "Deploy"
cp examples/index.html .
git init
git add --all
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/guiseek/angular-facebook-factory.git" master:gh-pages