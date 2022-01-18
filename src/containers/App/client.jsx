import { create, defaults } from 'axios';

var axiosInstance = create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  /* other custom settings */
});

export default axiosInstance