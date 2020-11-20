import Axios from 'axios';

const api = Axios.create({
    baseURL: "https://expose-backend.herokuapp.com:3333/",
    timeout: 3000
});

export default api;