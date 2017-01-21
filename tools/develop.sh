sh tools/prebuild.sh
open build/index.html
echo "Watching JavaScript source for changes..."
NODE_PATH="$(pwd)/lib" watchify -e src/main.js -o build/game.js --node --debug
