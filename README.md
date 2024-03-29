# Peerprep G05

![Peerprep logo](frontend/public/static/peerprep_logo_white.png)

## Team members
- [Melvin](https://github.com/gweemelvin)
- [Hui Ting](https://github.com/huiting-ht)
- [Amber](https://github.com/amber-le)
- [Wen Li](https://github.com/zzlilyzz)
- [Bin Rong](https://github.com/yeebinrong)


### Quick Start with Docker
1. Create a Cloud DB URL using Mongo Atlas.
2. Rename `backend\user-service\.env.sample` file to `backend\user-service\.env`.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Make sure JWT_SECRET used in `.env` is the same with User-Service's JWT_SECRET in `.env`
5. Repeat 2. and 3. for the other services as well
6. Build the docker images using the `docker-compose.yml` file using the `docker-compose build` command.
7. Start the docker containers using `docker-compose up` command.
8. Navigate to [http://localhost:3000](http://localhost:3000) to start using the application.
9. When done, terminate the containers using `docker-compose down` command.

### Manual Start
1. Follow the instructions [here](./backend/README.md) to setup the backend for manual start
2. Follow the instructions [here](./frontend/README.md) to setup the frontend for manual start
