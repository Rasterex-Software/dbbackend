#!/bin/bash

echo "Setting up postgres..."

# Run the schema.sql script against the 'postgres' database as the 'postgres' user
psql -d postgres -U postgres -f schema.sql

