import axios from 'axios';

// membuat baseURL untuk hit endpoint yg dituju
export const API = axios.create({
  // baseURL: process.env.SERVER_URL ||'https://dumbmerch-b34dhns.herokuapp.com/api/v1/'||'http://localhost:3500/api/v1/',
  baseURL:'https://dmbmerch-api.up.railway.app/api/v1/',
});

export const setAuthToken = (token) => {
  if (token) {
    // jika token ada
    // kirim ke headers, dengan isi authorization 
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    
    delete API.defaults.headers.common['Authorization'];
  }
};