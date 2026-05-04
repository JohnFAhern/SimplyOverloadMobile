import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_HOST = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_HOST
});

api.interceptors.request.use(async (config) => {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        config.headers.Authorization = `Bearer ${user.token}`;
        console.log('Token attached:', user.token)  // add this
    } else {
        console.log('No user found in storage')  // add this
    }
    return config;
});

export default api;