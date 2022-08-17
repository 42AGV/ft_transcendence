#!/usr/bin/env bash

# Simple script to ensure db and table creation before filling up

SETUP_DIR=/var/lib/postgresql/setup
TABLES=schema.sql

echo "$0: running $TABLES"; psql -d "$POSTGRES_DB" -f "$SETUP_DIR/$TABLES";

for f in $SETUP_DIR/*.sql; do
    if [ "$f" != "$SETUP_DIR/$TABLES" ] ; then
        echo "$0: running $f"; psql -d "$POSTGRES_DB" -f "$f";
    fi
done
