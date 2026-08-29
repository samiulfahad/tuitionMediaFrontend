// instituteService.js
import baseAPI from "./baseAPI";

const instituteService = {
  getAll: () => baseAPI.get("/institutes").then((res) => res.data),

  getOne: (id) => baseAPI.get(`/institutes/${id}`).then((res) => res.data),

  create: (name) => baseAPI.post("/institutes", { name }).then((res) => res.data),

  update: (id, name) => baseAPI.patch(`/institutes/${id}`, { name }).then((res) => res.data),

  remove: (id) => baseAPI.delete(`/institutes/${id}`).then((res) => res.data),
};

export default instituteService
