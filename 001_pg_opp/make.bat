@echo off
SET FILE_LIST=js\opp.js
SET FILE_LIST=%FILE_LIST% js\panel-lex.js
@echo on

java  -jar ..\..\tools\compiler.jar  --js_output_file=js\opp.min.js %FILE_LIST%

pause
