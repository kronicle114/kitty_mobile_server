# Kitty Server Mobile

I'm using MERN for my server tech stack.

To-do

1. Protec cats endpoint so only the user can add, delete, and change their cats
2. get all cats is unprotected though :D

## Steps

1. Create a mongodDB account through [register](https://cloud.mongodb.com/user?_ga=2.143925813.1205106697.1561888201-84316061.1558637210#/atlas/register/accountProfile)
2. Create a cluster
3. Create a database
4. Connect db to app
5. Create CRUD endpoints

## dev instructions

1. npm install
2. spin up a daemon, usually do `mongod`
3. npm start
4. start doing server stuff (make reqs on endpoints, maybe do the cheese test)
5. create robust error handlers

## troubleshooting

- as of 6/28/19 my localmachine doesn't accept 8080 as a server port, has something to do with the way my paths hooked up. i probbaly messed something up at some point, any wayyyyyyy just change your PORT to default to something other than `8080`. I'm using `8085`

- If you're trying to make a user on a `POST` here's some clues to test it on POSTMAN:

1. full endpoint `http://localhost:8085/api/users/`
2. make sure that it's a POST request
3. On body, make sure its `raw` and content-type is set to JSON (application/json)
4. a valid post is

```
{
   "username":  "cat1",
   "password": "kittycat12"
}
```

should get a return like this:

```
{
    "username": "cat1",
    "name": "",
    "id": "5d15e1a65d22183610958fcc"
}
```

check out my users models for more info

- to get an auth token, you need to do a POST on the auth login
- fyi, ideally you wanna use an `.env` file to store all the jwt secret env variables but like this is just a demo app so... its fine for now

1. full url to login: `http://localhost:8085/api/auth/login`
2. raw, json
   valid credentials in body:

```
{
	"username": "cat1",
	"password": "kittycat12"
}
```

returns an authtoken valid for 7d unless you get booted out or refresh it:

```
{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiY2F0MSIsIm5hbWUiOiIiLCJpZCI6IjVkMTVlMWE2NWQyMjE4MzYxMDk1OGZjYyJ9LCJpYXQiOjE1NjE3MTU4MTUsImV4cCI6MTU2MjMyMDYxNSwic3ViIjoiY2F0MSJ9.6irk-Wt79ae8VctSmbQVRd7wmO74jdzSG5WsIyFb4tc"
}
```

## error handler example:

### duplicate user

it's nice if your app checked your db for unique properties. Even better that your error handler points exactly to that error. Check out how I handle this using unique `username` documents

- path POST `http://localhost:8085/api/users/`
- duplicate username reqbody example (the username `hey` already exists in the mongodb)

```
{
	"username": "hey",
	"password": "kittycat123"
}
```

- error response

```json
{
  "code": 422,
  "reason": "ValidationError",
  "message": "Username already taken",
  "location": "username"
}
```

## Endpoints

1. POST http://localhost:8085/api/cats/

BODY:

```json
{
  "name": "Bruno",
  "age": 2,
  "description": "he's a pretty cute cat"
}
```

RESPONSE:

```json
{
  "_id": "5d1ea56e685f71003693baac",
  "name": "Bruno",
  "age": "2",
  "description": "he's a pretty cute cat",
  "createdAt": "2019-07-05T01:18:38.963Z",
  "updatedAt": "2019-07-05T01:18:38.963Z",
  "__v": 0
}
```

2. GET http://localhost:8085/api/cats/

response:

```json
[
  {
    "_id": "5d1ea56e685f71003693baac",
    "name": "Bruno",
    "age": "2",
    "description": "he's a pretty cute cat",
    "createdAt": "2019-07-05T01:18:38.963Z",
    "updatedAt": "2019-07-05T01:18:38.963Z",
    "__v": 0
  }
]
```

3. PUT http://localhost:8085/api/cats/5d1ea56e685f71003693baac

BODY:

```json
{
  "name": "Bruno Mars2",
  "age": 3,
  "description": "he's a talented mofo cat!!!"
}
```

RES:

```json
{
  "_id": "5d1ea56e685f71003693baac",
  "name": "Bruno Mars",
  "age": "1",
  "description": "he's a talented mofo cat",
  "createdAt": "2019-07-05T01:18:38.963Z",
  "updatedAt": "2019-07-05T01:24:36.985Z",
  "__v": 0
}
```

3. GET by ID

```json
{
  "_id": "5d1ea56e685f71003693baac",
  "name": "Bruno Mars2",
  "age": "3",
  "description": "he's a talented mofo cat!!!",
  "createdAt": "2019-07-05T01:18:38.963Z",
  "updatedAt": "2019-07-05T01:25:19.873Z",
  "__v": 0
}
```
