@echo off
SET FILE_LIST=js\op2.js
SET FILE_LIST=%FILE_LIST% js\panel-lex.js
SET FILE_LIST=%FILE_LIST% js\parser.js
@echo on

java  -jar ..\..\tools\compiler.jar  --js_output_file=js\op2.min.js %FILE_LIST%

pause
