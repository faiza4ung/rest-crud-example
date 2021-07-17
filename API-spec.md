# API Spec MERN

## Url

{root.api}/{version}/{grouping}/{endpoint}
Sample:
<http://mern-api.back-api.com/v1/auth/login>

Standar Status Response
|Code| Arti                   |Ket|
|-   |-                       |-  |
|200 | - OK |                 | Call API Success|
|201 |- CREATED               | Post Success|
|400 |- BAD REQUEST           | Error on Client Side(Bisa input yang salah dll)|
|401 |- UNAUTHORIZED          | User not authorized to the request|
|403 |- FORBIDDEN             | User not allowed to access|
|404 |- NOT FOUND             | request endpoint not found|
|500 |- INTERNAL SERVER ERROR | error on server side||
|502 |- BAD GATEWAY           | Invalid response from another request|

## Group : Authentication

- Register
{root.api}/{version}/auth/login

```json
req:
{
    "name": "Test",
    "email": "contoh@gmail.com",
    "password": "123456"
}
```

```json
{
  "message": "Register Success",
  "data": {
    "id": "1",
    "name": "Test",
    "email": "contoh@gmail.com",
    "password": "123456"
  }
}
```

err-response:
400 - Input yang anda masukan tidak valid

- Login

## Group : Blog

- Create Blog Post
- Get Blog Post
- Update Blog Post
- Delete Blog Post
