import axios from 'axios';

const getBaseUrl = () => {
    let url;
    switch(import.meta.env.MODE) {
      case 'production':
        url = import.meta.env.VITE_PROD_API_URL;
        break;
      case 'development':
      default:
        url = import.meta.env.VITE_DEV_API_URL;
    }
    return url;
  }

  const getBaseUrlRunner = () => {
    let url;
    switch(import.meta.env.MODE) {
      case 'production':
        url = import.meta.env.VITE_PROD_RUNNER_API_URL;
        break;
      case 'development':
      default:
        url = import.meta.env.VITE_DEV_RUNNER_API_URL;
    }
    return url;
  }

export default axios.create({
    baseURL: getBaseUrl()
});

export const axiosPrivate = axios.create({
    baseURL: getBaseUrl(),
    headers: { 'Content-Type' : 'application/json'},
    withCredentials: true
});

export const axiosRunner =  axios.create({
  baseURL: getBaseUrlRunner()
});

export const axiosPrivateRunner = axios.create({
  baseURL: getBaseUrlRunner(),
  headers: { 'Content-Type' : 'application/json'},
  withCredentials: true
});