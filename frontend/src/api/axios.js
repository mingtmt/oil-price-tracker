import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL của FastAPI
});

export default api;