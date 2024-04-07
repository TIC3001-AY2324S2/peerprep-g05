import http from "http";
import index from "./index.js";
import dotenv from "dotenv";
import "dotenv/config";

// Read .env from root parent folder if docker is not used
if (process.env.IS_DOCKER != "true") {
    dotenv.config({ path: '../../.env' });
}

const port = process.env.MATCHING_SVC_PORT || 3003;

const server = http.createServer(index);

console.log("Starting on Port:", port);

server.listen(port);