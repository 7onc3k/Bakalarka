#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <markdown_file>"
    exit 1
fi

input_file="$1"
base_name=$(basename "$input_file" .md)
output_file="${base_name}.pdf"

pandoc "$input_file" -o "$output_file"

if [ $? -eq 0 ]; then
    echo "Successfully converted $input_file to $output_file"
else
    echo "Error converting $input_file to $output_file"
fi
