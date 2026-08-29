// baseAPI.js
import axios from "axios";
const cloud = "https://client-api.labpilotpro.com/v1"
const local = "http://127.0.0.1:3000/v1"

const baseAPI = axios.create({
  baseURL: local, // change to your Fastify server URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAPI;