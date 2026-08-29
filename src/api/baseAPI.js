// baseAPI.js
import axios from "axios";

const baseAPI = axios.create({
  baseURL: "http://localhost:3000/v1", // change to your Fastify server URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseAPI;