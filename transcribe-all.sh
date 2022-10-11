#! /bin/bash

transcription_dir='static/transcriptions'
previous=0

for file in content/audio/*; do
    number=$(echo $file | grep -o 'thetalkshow[-e]*\d*[-a\.]' | grep -o '\d*' | sed -r 's/0*([0-9]*)/\1/')

    if [ ! $number ]; then
        number=$(echo $file | grep -o 'ep-\d*[-\.]' | grep -o '\d*' | sed -r 's/0*([0-9]*)/\1/')
    fi
    
    if [ ! $number ]; then
        number=$(echo $file | grep -o 'episode-\d*[-\.]' | grep -o '\d*' | sed -r 's/0*([0-9]*)/\1/')
    fi
    
    if [ ! $number ]; then
        number=$(echo $file | grep -o 'show-\d*[-\.]' | grep -o '\d*' | sed -r 's/0*([0-9]*)/\1/')
    fi

    if [ ! $number ]; then
        let "number=previous+1"
    fi
    previous=$number

    transcription_file_path="$transcription_dir/$number.txt"

    if [ ! -f "$transcription_file_path" ]; then
        # whisper...
        # PYTORCH_ENABLE_MPS_FALLBACK=1
        # whisper $file --language English --model medium.en --device mps --fp16 False > $transcription_file_path
        whisper $file --language English --model tiny.en --fp16 False > $transcription_file_path
    fi
done