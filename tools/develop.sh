CWD=`pwd`
export NODE_PATH="${CWD}/lib"
mkdir -p build
cp -R static/ build
watchify -e src/main.js -o build/game.js --node --debug
