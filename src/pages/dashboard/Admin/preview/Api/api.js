import axios from "axios";
import { API_BASE_URL } from "@/config/env";

// API base URL - would come from environment variables in production
// const API_BASE_URL = "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Ensure you're using the correct token key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token to Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Document API services
export const documentService = {
  // Get all documents
  getAll: async () => {
    const response = await api.get("/documents/preview");
    return response.data;
  },

  // Get document by ID
  getById: async (_id) => {
    const response = await api.get(`/documents/preview/${_id}`);
    return response.data;
  },

  // Create new document
  create: async (documentData) => {
    const response = await api.post("/documents/preview/", documentData);
    return response.data;
  },

  // Update document
  update: async (_id, documentData) => {
    const response = await api.put(`/documents/preview/${_id}`, documentData);
    return response.data;
  },

  // Delete document
  delete: async (_id) => {
    const response = await api.delete(`/documents/preview/${_id}`);
    return response.data;
  },
};

export default api;



// import axios from "axios"
// import { API_BASE_URL } from "@/config/env";
// // API base URL - would come from environment variables in production
// // const API_BASE_URL = "http://localhost:5000/api"

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
// })

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // Document API services
// export const documentService = {
//   // Get all documents
//   getAll: async () => {
//     const response = await api.get("/documents")
//     return response.data
//   },

//   // Get document by ID
//   getById: async (id) => {
//     const response = await api.get(`/documents/${id}`)
//     return response.data
//   },

//   // Create new document
//   create: async (documentData) => {
//     const response = await api.post("/documents", documentData)
//     return response.data
//   },

//   // Update document
//   update: async (id, documentData) => {
//     const response = await api.put(`/documents/${id}`, documentData)
//     return response.data
//   },

//   // Delete document
//   delete: async (id) => {
//     const response = await api.delete(`/documents/${id}`)
//     return response.data
//   },
// }

// export default api

