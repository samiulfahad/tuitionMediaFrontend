// tutorCvApi.js
import baseAPI from "./baseAPI";

function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message = err.response?.data?.error || err.message || "Something went wrong.";
      throw new Error(message);
    });
}

const tutorCvApi = {
  getMeta: () => unwrap(baseAPI.get("/tutor-cv-meta")),
  getInstitutes: () => unwrap(baseAPI.get("/institutes")),

  browse: (params) => unwrap(baseAPI.get("/tutors/browse", { params })),

  create: (payload) => unwrap(baseAPI.post("/tutor-cvs", payload)),

  search: ({ phone, email }) => unwrap(baseAPI.get("/tutor-cvs/search", { params: { phone, email } })),

  verifyPin: (id, pin) => unwrap(baseAPI.post(`/tutor-cvs/${id}/verify-pin`, { pin })),

  update: (id, payload) => unwrap(baseAPI.patch(`/tutor-cvs/${id}`, payload)),

  changePin: (id, currentPin, newPin) => unwrap(baseAPI.patch(`/tutor-cvs/${id}/pin`, { currentPin, newPin })),

  remove: (id, pin) => unwrap(baseAPI.delete(`/tutor-cvs/${id}`, { data: { pin } })),
};

export default tutorCvApi;
