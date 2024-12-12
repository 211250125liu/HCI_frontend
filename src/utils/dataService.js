import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8081/cities';  // 替换成你的后端地址

export default {
    getAllProvinces() {
        return axios.get(`${API_BASE_URL}/provinces`);
    },

    getCitiesByProvince(provinceName) {
        return axios.get(`${API_BASE_URL}/byProvince/${provinceName}`);
    },

    saveCity(city) {
        return axios.post(`${API_BASE_URL}/cities`, city);
    },
};
