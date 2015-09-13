#!/bin/bash

echo "BGG Build - Npm Install"
npm install
#echo "BGG Build - Grunt"
#grunt build
echo "BGG Build - making deploy.tar.gz"
tar -czf deploy.tar.gz lib node_modules controllers www config.json package.json