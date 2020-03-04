#! /bin/bash

date=`date "+%Y%m%d_%H%M%S"`
#git_commit=`git rev-parse HEAD`
git_commit=`git rev-parse --short HEAD`
# zip "../_archives/google-conversation-action_${date}-${git_commit}.zip" -r ./ -x *.DS_Store *.git* *node_modules* ./functions/js\*
zip "google-conversation-action_${date}.zip" -r ./ -x *.DS_Store *.git* *node_modules* ./functions/js\*