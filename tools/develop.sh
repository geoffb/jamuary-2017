sh tools/prebuild.sh
NODE_PATH="$(pwd)/lib" watchify -e src/main.js -o build/game.js --node --debug
