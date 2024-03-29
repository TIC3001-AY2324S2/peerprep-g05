# Peerprep-G05 Backend

## User Service

### Quick Start
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Install npm packages using `npm ci`.
5. Run User Service using `npm run dev`.

### Complete User Service Guide: [User Service Guide](./user-service/README.md)

## Question Service

### Quick Start
1. Rename `.env.sample` file to `.env`.
2. Make sure JWT_SECRET in `.env` is the same with User-Service's `.env`
3. Create a Cloud DB URL using Mongo Atlas.
4. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
5. Navigate to ./question-service directory
6. Install npm packages using `npm ci`.
7. Run Question Service using `npm start`

### Upload Sample Qns Data for Qns Service (via MongoDBCompass)
1. Connect the MongoDB Cloud deployment you've created on MongoDB.
2. Access "test" database, then access "questionmodels" collection
3. Click "Add Data"
4. Select "Import JSON or CSV file"
5. Load the CSV file @ [Sample Qns Repo CSV](./question-service/data)

### Complete Question Service Guide: [Question Service Guide](./question-service/README.md)