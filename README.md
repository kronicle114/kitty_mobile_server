# Kitty Server Mobile

## Steps

1. Create a mongodDB account through register
2. Build your first cluster biaaaaatch
3. Create a cluster
4. Create a database
5. Connect db to app

## dev instructions

1. npm install
2. npm start

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
