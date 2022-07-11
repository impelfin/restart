#!/bin/bash

mongodb=$(ps -ef | grep mongo)
mysql=$(ps -ef | grep mysql)

second1=$(echo ${mongodb} | cut -d " " -f2)
second2=$(echo ${mysql} | cut -d " " -f2)

for var in $second1 $second2
do
    if [ -n ${var} ]
    then
      echo "${var} process is running."
    else
      echo "running process not found."
    fi
done