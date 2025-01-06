# rx-back-end


## Project setup
```
npm install
```

### Run
```
node server.js
```
Server run on port 8080, base url: http://localhost:8080

### Test the APIs
Using Postman.
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
