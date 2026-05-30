import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_HOST = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_HOST
});

api.interceptors.request.use(async (config) => {
    console.log("Full request URL:", config.baseURL + config.url)
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;