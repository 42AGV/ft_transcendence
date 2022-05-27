#!/usr/bin/env bash

# Simple script to ensure db and table creation before filling up

SETUP_DIR=/var/lib/postgresql/setup
TABLES=schema.sql

echo "$0: running $TABLES"; psql -f "$SETUP_DIR/$TABLES";

for f in $SETUP_DIR/*; do
    if [[ "$f" == *.sql ]] && [ "$f" != "$SETUP_DIR/$TABLES" ] ; then
        echo "$0: running $f"; psql -f "$f";
    else
        echo "$0: ignoring $f";
    fi
done
