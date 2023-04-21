import axios from 'axios';

// export const urlAPI = `http://ringo-supp2.metais.cefim.o2switch.site/public/api/`;
export const urlAPI = `http://localhost:8888/ringo_supp/API_Laravel/public/api/`;

export const baseUrl = axios.create({
  baseURL: urlAPI,
  withCredentials: true,
});