# Peerprep G05

![Peerprep logo](frontend/public/static/peerprep_logo_white.png)

## Team members
- [Melvin](https://github.com/gweemelvin)
- [Hui Ting](https://github.com/huiting-ht)
- [Amber](https://github.com/amber-le)
- [Wen Li](https://github.com/zzlilyzz)
- [Bin Rong](https://github.com/yeebinrong)

# Setting up
1. Head to this [README.md](./backend/README.md) for instructions to setup the backend.
1. Head to this [README.md](./frontend/README.md) for instructions to setup the frontend.
### Quick Start with Docker
1. Create a Cloud DB URL using Mongo Atlas.
2. Rename [.env.sample](./.env.sample) file to `.env`.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
6. Ensure your docker daemon is running.
7. Build the docker images with the `docker-compose.yml` file using the `docker-compose build` command.
8. Start the docker containers using `docker-compose up` command.
9. Navigate to [http://localhost:3000](http://localhost:3000) to start using the application.
10. When done, terminate the containers using `docker-compose down` command.

### Manual Start
1. Follow the instructions [here](./backend/README.md) to setup the backend for manual start
2. Follow the instructions [here](./frontend/README.md) to setup the frontend for manual start
