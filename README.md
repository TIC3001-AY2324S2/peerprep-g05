# Peerprep G05

![Peerprep logo](frontend\public\static\peerprep_logo_white.png)

## Team members
- [Melvin](https://github.com/gweemelvin)
- [Hui Ting](https://github.com/huiting-ht)
- [Amber](https://github.com/amber-le)
- [Wen Li](https://github.com/zzlilyzz)
- [Bin Rong](https://github.com/yeebinrong)


### Quick Start with Docker
1. Create a Cloud DB URL using Mongo Atlas.
2. Rename `backend\user-service\.env.sample` file to `backend\user-service\.env`.
3. Enter the DB URL created as `MONGO_DB_URI` in `.env` file.
4. Repeat 2. and 3. for the other services as well
5. Build the docker images using the `docker-compose.yml` file using the `docker-compose build` command.
6. Start the docker containers using `docker-compose up` command.
7. Navigate to [http://localhost:3000](http://localhost:3000) to start using the application.
8. When done, terminate the containers using `docker-compose down` command.

### Manual Start
1. Create a Cloud DB URL using Mongo Atlas.
2. Rename `backend\user-service\.env.sample` file to `backend\user-service\.env`.
3. Enter the DB URL created as `MONGO_DB_URI` in `.env` file.
4. Repeat 2. and 3. for the other services as well
5. Enter `npm ci` to clean install the node modules for each backend service and frontend folders
6. Start each service in `backend` using `npm run dev`
7. Start frontend using `npm start`
8. Navigate to [http://localhost:3000](http://localhost:3000) to start using the application.
