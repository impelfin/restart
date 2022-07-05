#!/bin/bash

mongoimport -d test -c seoul --headerline --type csv --drop seoul.csv
