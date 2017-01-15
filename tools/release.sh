sh tools/build.sh
closure-compiler --js build/game.js --js_output_file build/game.min.js
mv build/game.min.js build/game.js
