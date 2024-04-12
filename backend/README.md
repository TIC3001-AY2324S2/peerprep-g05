# Peerprep-G05 Backend

# Prerequisite
1. Create a Cloud DB URL using Mongo Atlas.
2. Rename [./../.env.sample](./../.env.sample) file to `.env`.
3. Enter the DB URL created as `DB_URI` in `.env` file.

## User Service

### Quick Start
1. Navigate to [./user-service/](./user-service/) directory
2. Install npm packages using `npm ci`.
3. Run User Service using `npm run dev`.

### Complete User Service Guide: [User Service Guide](./user-service/README.md)

## Question Service

### Quick Start
1. Navigate to [./question-service](./question-service/) directory
2. Install npm packages using `npm ci`.
3. Run Question Service using `npm run dev`

### Upload Sample Qns Data for Qns Service (via MongoDBCompass)
1. Connect the MongoDB Cloud deployment you've created on MongoDB.
2. Access "test" database, then access "questionmodels" collection
3. Click "Add Data"
4. Select "Import JSON or CSV file"
5. Load the CSV file @ [Sample Qns Repo CSV](./question-service/data)

### Complete Question Service Guide: [Question Service Guide](./question-service/README.md)

## Matching Service

### Quick Start
1. Navigate to [./matching-service](./matching-service/) directory
2. Install npm packages using `npm ci`.
3. Run Question Service using `npm run dev`

### Complete Question Service Guide: [Matching Service Guide](./matching-service/README.md)