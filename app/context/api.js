import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_HOST = 'https://simplyoverloadbackendjava-production.up.railway.app/api/v1';

const api = axios.create({
    baseURL: API_HOST
});

let cachedToken = null;

export const setApiToken = (token) => { cachedToken = token; };
export const clearApiToken = () => { cachedToken = null; };

api.interceptors.request.use(async (config) => {
    console.log("Full request URL:", config.baseURL + config.url)
    if (!cachedToken) {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
            cachedToken = JSON.parse(userString).token;
        }
    }
    if (cachedToken) {
        config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return config;
});

export default api;