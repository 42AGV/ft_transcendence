#!/bin/sh
if [ -z "$1" ]; then
  echo "This script takes the regex matching the container to retrieve as an argument"
  return 1
fi
docker container ls | grep "$1" | awk 'NF>1{print $NF}'
