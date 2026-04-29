import axios from "axios";
// import { storeToRefs } from 'pinia'

import { apiURL } from "@/global-variable";

axios.interceptors.request.use((config) => {
    config.headers.Accept = "application/json";
    return config;
});

axios.defaults.baseURL = apiURL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
        }
        return Promise.reject(error);
    }
);

export default axios;
