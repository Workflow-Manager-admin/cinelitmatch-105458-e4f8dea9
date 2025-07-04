#!/bin/bash
cd /home/kavia/workspace/code-generation/cinelitmatch-105458-e4f8dea9/frontend_web
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

