# Matching Service Guide

## Running Matching Service

1. Open Command Line/Terminal and navigate into the `matching-service` directory.

2. Run the command: `npm install`. This will install all the necessary dependencies.

3. Run the command `npm start` to start the Matching Service.

4. Using applications like Postman, you can interact with the Matching Service on port **3003**. If you wish to change this, please update the `.env` file.

## Matching Service API Guide

### Start Matching

- This endpoint adds the user to the pool for matching

- HTTP Method: `POST`

- Endpoint : http://localhost:3003/api/match/start

- Body: Required: username (string), email (string), complexity (String) : (enum - 'Easy', 'Medium', 'Hard'), category (string)

```json
{
  "username": "aaa",
  "email": "aaa@gmail.com",
  "complexity": "Easy",
  "category": "Samplecategory"
}
```

- <a name="auth-header">Headers:</a> Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity and permissions. The server verifies this token to ensure that the client is authorized to access the matching data.

  - Auth Rules:

    - Users: Only registered users can match with other users. The server checks if the email in the request body matches the email of the user associated with the JWT token. If it matches, the server returns the user's own data.


- Responses:

| Response Code               | Result                                                   |
| --------------------------- | -------------------------------------------------------- |
| 200 (OK)               | Started Matching Successfully Successfully                              |               |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT         |
| 403 (Forbidden)             | Access Denied for User Accessing Others' Data |                           |
| 500 (Internal Server Error) | Internal Server Error

#### Cancel Matching

- This endpoint removes the user from the pool for matching

- HTTP Method: `POST`

- Endpoint : http://localhost:3003/api/match/cancel

- Body: Required: username (string), complexity (String) : (enum - 'Easy', 'Medium', 'Hard'), category (string)

```json
{
  "username": "aaa",
  "complexity": "Easy",
  "category": "Samplecategory"
}
```

- <a name="auth-header">Headers:</a> Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity and permissions. The server verifies this token to ensure that the client is authorized to access the matching data.

  - Auth Rules:

    - Users: Only registered users can match with other users. The server checks if the email in the request body matches the email of the user associated with the JWT token. If it matches, the server returns the user's own data.


- Responses:

| Response Code               | Result                                                   |
| --------------------------- | -------------------------------------------------------- |
| 200 (OK)               | Cancelled Matching Successfully Successfully                              |               |
| 401 (Unauthorized)          | Access Denied Due to Missing/Invalid/Expired JWT         |
| 403 (Forbidden)             | Access Denied for User Accessing Others' Data |                           |
| 500 (Internal Server Error) | Internal Server Error

### Get All Matches

- This endpoint allows one to retrieve the data of all the Matches from the database for a user.

- HTTP Method: `GET`

- Endpoint: http://localhost:3002/api/match/:email

- Query: 
  - `email`: Email. Example: `aaa@gmail.com`

- Parameters: 
  - `page`: Page number. Example: `page=1`
  - `limit`: Max number of match history per page. Example: `limit=8`

- Example: http://localhost:3003/api/match/aaa@gmail.com?page=1&limit=8

- Body: Not Required

- Headers: Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity and permissions. The server verifies this token to ensure that the client is authorized to access the matching data.

  - Auth Rules:

    - Users: Only registered users can match with other users. The server checks if the email in the request body matches the email of the user associated with the JWT token. If it matches, the server returns the user's own data.

- Responses:

| Response Code      | Result                                           |
| ------------------ | ------------------------------------------------ |
| 200 (OK)           | All Matching Data Obtained                       |
| 500 (Internal Server Error)  | Internal Server Error                         |
| 401 (Unauthorized) | Access Denied Due to Missing/Invalid/Expired JWT |
| 403 (Forbidden)    | Access Denied for User Accessing Others' Data    |
