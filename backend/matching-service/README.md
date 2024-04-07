# User Service Guide

## Setting up local mongoDB container

1. Install Docker
2. Run `docker compose -f docker-compose.mongo.yaml up` to start the mongoDB container. Default username and password are `root` and `example` respectively.


## Setting-up

> Note: If you are familiar to MongoDB and wish to use a local instance, please feel free to do so. This guide utilises MongoDB Cloud Services.

1. Set up a MongoDB Shared Cluster by following the steps in this [Guide](./MongoDBSetup.md).

2. After setting up, go to the Database Deployment Page. You would see a list of the Databases you have set up. Select `Connect` on the cluster you just created earlier on for User Service.

![alt text](./GuideAssets/ConnectCluster.png)

3. Select the `Drivers` option, as we have to link to a Node.js App (User Service)

![alt text](./GuideAssets/DriverSelection.png)

4. Select `Node.js` in the `Driver` pull-down menu, and copy the connection string.

Notice, you may see `<password>` in this connection string. We will be replacing this with the admin account password that we created earlier on when setting up the Shared Cluster.

![alt text](./GuideAssets/ConnectionString.png)

5. Rename the `.env.sample` file to `.env` in the `user-service` directory.

6. Update the `DB_CLOUD_URI` of the `.env` file, and paste the string we copied earlier in step 4. Also remember to replace the `<password>` placeholder with the actual password.

```
DB_CLOUD_URI=<CONNECTION_STRING>
DB_LOCAL_URI=mongodb://localhost/${KEY_IN_YOUR_DB_HERE}
PORT=3003
ENV=PROD
JWT_SECRET=you-can-replace-this-with-your-own-secret
```

## Running Matching Service

1. Open Command Line/Terminal and navigate into the `matching-service` directory.

2. Run the command: `npm install`. This will install all the necessary dependencies.

3. Run the command `npm start` to start the Matching Service.

4. Using applications like Postman, you can interact with the User Service on port **3003**. If you wish to change this, please update the `.env` file.

## User Service API Guide

## POST Find a peer

POST /api/match/find

> Body Parameters

```json
{
  "userId": "string",
  "level": 0
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» userId|body|string| yes |none|
|» level|body|integer| yes |none|

> Response Examples

> 成功

```json
{
  "message": "Match not found!",
  "record": {
    "_id": "660412a1498bacb518629fa5",
    "userId": "6604129c9b59f7ac3d1bf031",
    "level": 2,
    "roomId": null,
    "createdAt": "2024-03-27T12:35:45.551Z",
    "__v": 0
  }
}
```

> 请求有误

```json
{
  "message": "Existing Record is not expired!",
  "recordId": "6604125a498bacb518629fa0",
  "roomId": null
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|请求有误|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||Record status|
|» record|object|true|none||none|
|»» _id|string|true|none||none|
|»» userId|string|true|none||none|
|»» level|integer|true|none||none|
|»» roomId|string¦null|true|none||none|
|»» createdAt|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» recordId|string|true|none||none|
|» roomId|string¦null|true|none||none|

## GET Get match record

GET /api/match/find

> Body Parameters

```json
{
  "recordId": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» recordId|body|string| yes |none|

> Response Examples

> 成功

```json
{
  "message": "Match record found!",
  "record": {
    "_id": "66041395498bacb518629fb9",
    "userId": "6604138cbca669f1897eb014",
    "level": 2,
    "roomId": null,
    "createdAt": "2024-03-27T12:39:49.178Z",
    "__v": 0
  }
}
```

> 请求有误

```json
{
  "message": "Match record not found!"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|请求有误|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» record|object|true|none||none|
|»» _id|string|true|none||none|
|»» userId|string|true|none||none|
|»» level|integer|true|none||none|
|»» roomId|string|true|none||none|
|»» createdAt|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET Hello

GET /api/match

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema

## GET Find room

GET /api/ongoing

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|roomId|query|string| no |none|

> Response Examples

> 成功

```json
{
  "message": "Room found!",
  "room": {
    "_id": "6600b8ab6a2206ed960b6b5c",
    "userIds": [
      "6600b8a825297a286d0d6d2a",
      "6600b69499b10db462f32795"
    ],
    "level": 1,
    "isActive": true,
    "createdAt": "2024-03-24T23:35:07.821Z",
    "__v": 0
  }
}
```

> 记录不存在

```json
{
  "message": "Room not found!"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在|Inline|

### Responses Data Schema

## DELETE Delete a room

DELETE /api/ongoing

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|roomId|query|string| no |none|

> Response Examples

> 成功

```json
{
  "message": "Room deleted!"
}
```

> 请求有误

```json
{
  "message": "Room ID is missing!"
}
```

> 记录不存在

```json
{
  "message": "Room not found!"
}
```

> 服务器错误

```json
{
  "message": "Database failure when deleting room!"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|请求有误|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|记录不存在|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|服务器错误|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# Data Schema