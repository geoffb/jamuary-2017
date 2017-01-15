sh tools/prebuild.sh
NODE_PATH="$(pwd)/lib" browserify -e src/main.js -o build/game.js --node
