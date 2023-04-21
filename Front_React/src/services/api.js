import axios from 'axios';

// export const urlAPI = `http://xxx/public/api/`;
export const urlAPI = `http://localhost:8888/xxx/API_Laravel/public/api/`;

export const baseUrl = axios.create({
  baseURL: urlAPI,
  withCredentials: true,
});