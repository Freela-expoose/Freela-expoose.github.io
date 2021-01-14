import Axios from 'axios';

const api = Axios.create({
    baseURL: "http://ec2-3-137-191-100.us-east-2.compute.amazonaws.com:3333/",
    timeout: 3000
});

export default api;