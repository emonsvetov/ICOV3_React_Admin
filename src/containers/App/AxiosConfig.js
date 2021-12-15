import axios from "axios";
const axiosConfig = () => 
{
    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
    // axios.defaults.headers.common["Content-Type"] = 'application/json';
}

export default axiosConfig;