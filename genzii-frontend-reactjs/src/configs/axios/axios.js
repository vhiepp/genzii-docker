
import axios from 'axios'; 

const axiosAppJson = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_BACKEND,
    timeout: 10000,
    withCredentials: true,
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    }
});

const axiosFromData = axios.create({
    baseURL: process.env.REACT_APP_DOMAIN_BACKEND,
    maxBodyLength: Infinity,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export { axiosAppJson, axiosFromData }; 
