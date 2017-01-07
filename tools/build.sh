CWD=`pwd`
export NODE_PATH="${CWD}/lib"
mkdir -p build
cp -R static/ build
browserify -e src/main.js -o build/game.js --node
