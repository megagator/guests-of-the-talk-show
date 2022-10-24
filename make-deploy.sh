#! /bin/bash

download_audio () {
    cat ../content/episodes.json | jq '.[0].file.url' | xargs -r -I{} curl -L {} -O
}

if [[ -z $1 || $1 -ne '-f' ]]; then
    cd feed-parser/

    npm run parse && \
    download_audio && \
    cd ..  && \
    npm run lint && \
    npm run deploy
else
    npm run lint && \
    npm run deploy
fi
