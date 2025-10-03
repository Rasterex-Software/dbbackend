@ECHO OFF
echo.

pushd %~dp0

psql -d postgres -U postgres -f schema.sql

popd
