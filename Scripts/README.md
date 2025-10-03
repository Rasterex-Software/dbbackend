## DB naming rules
- Table/view name
  - Use singulative
  - All in little case
  - use "_" to connect words
  - Do not use abbreviation
- Colum name
  - All in little case
  - use "_" to connect words
  - Try use abbreviation
    - project - proj
    - annotation - anno
    - measurement - meas
    - permission - perm
    - description - desc

## Install PostgreSQL and setup environment
- Download from https://www.postgresql.org/download/, windows x64
- Version: 17.0
- Default Database: postgres
- Default Port: 5432
- Default user/password: postgres/postgres
- Add installation path (e.g., "c:\Program Files\PostgreSQL\17\bin") to system PATH environment
- Default data path (for windows): C:\Program Files\PostgreSQL\17\data

### Check service status, start/stop (windows)
Type win + r, then execute `services.msc`, find `postgresql-x64-17`. You can start/stop it.

### Useful psql commands
```bash
$psql -U postgres
```
Input password `postgres` and press enter.
- `\?` provide help on psql commands
- `\q` to quit
- `\l` to list all databases
- `\c` connect to a new database
- `\d` list tables, views, and materialized views in the current database
- `\du` list roles (users)

### Use pgAdmin to connect to PostgreSQL


## Create tables and initialize data
```bash
setup_db.bat
```
