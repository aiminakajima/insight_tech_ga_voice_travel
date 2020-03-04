#! /bin/bash

# check installed firebase
which firebase || exit -1

applicationName='Travel Voice'

# deploy
firebase deploy --only functions --project=travel-voice
if [ $? -ne 0 ]; then
	which osascript > /dev/null && osascript -e "display notification \"エラーが発生しました\" with title \"${applicationName}\" sound name \"Basso\""
	exit -1
fi
date "+%Y/%m/%d %H:%M:%S"

# version increment
node hooks/_prepare_deploy.js

# waiting...
node hooks/_prologue_deploy.js

# notifiction
dep_ver=`cat ./functions/version.txt`
dep_message="Version ${dep_ver} のデプロイが完了しました"
which osascript  > /dev/null && osascript -e "display notification \"${dep_message}\" with title \"${applicationName}\" sound name \"Purr\""
