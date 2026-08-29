// baseAPI.js
import axios from "axios";

const baseAPI = axios.create({
  baseURL: "https://client-api.labpilotpro.com/v1", // change to your Fastify server URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAPI;