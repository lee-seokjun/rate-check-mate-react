import axios from 'axios';

const instance = axios.create({
  baseURL: "http://44.204.49.80:8080",
  // baseURL:"http://127.0.0.1:8080",
});

export default instance;