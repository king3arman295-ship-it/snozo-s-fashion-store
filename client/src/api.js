import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api"
})

// AUTO ADD TOKEN TO EVERY REQUEST
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken")

  if (token) {
    req.headers.Authorization = token
  }

  return req
})

export default API