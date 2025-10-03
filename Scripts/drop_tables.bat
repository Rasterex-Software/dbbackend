@ECHO OFF
echo.

pushd %~dp0

psql -d postgres -U postgres -f drop_tables.sql

popd
