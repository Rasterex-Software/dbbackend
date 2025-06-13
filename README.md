# rx-back-end



## Project setup
```
npm install
```
## Postgre SQL

Download and install for Windows version 17
https://www.postgresql.org/download/windows/


### Run
```
npm start
```
Server run on port 8080, base url: http://localhost:8080

### Test the APIs
Test REST APIs with swagger ui: http://localhost:8080/api-docs/

You can also use Postman.
- POST `api/login` user login
- GET `api/logout` user logout
- GET `api/users` get all users
- GET `api/users/:id` get a user by id
- PUT `api/users/:id` update a user
- POST `api/annotation` create an annotation
- GET `api/annotations/:id` get an annotation
- GET `api/annotations` get all annotations
- PUT `api/annotations/:id` update an annotations
- DELETE `api/annotations/:id` delete an annotations
- GET `api/projects/:projId/permissions` get permissions
- ...

## Run as a deamon

### Install pm2
```
npm install pm2 -g
```

### Start `rx-backend` as a deamon
```
pm2 start server.js --name "rx-backend"

```

### Check running ps
```
pm2 ps
```

### Stop `rx-backend`
```
pm2 stop rx-backend
```

