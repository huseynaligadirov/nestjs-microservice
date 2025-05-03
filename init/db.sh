#!/bin/bash
set -e

# List of databases to create
databases=("userdb" "orderdb")

for db in "${databases[@]}"; do
  echo "Creating database: $db"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "$db";
EOSQL
done
