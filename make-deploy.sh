#! /bin/bash

download_audio () {
    cat ../content/episodes.json | jq '.[0].file.url' | xargs -r -I{} curl -L {} -O
}

cd feed-parser/

npm run parse && \
# download_audio && \
cd .. && \
npm run lint && \
npm run deploy