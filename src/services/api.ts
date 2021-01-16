import Axios from 'axios';

const api = Axios.create({
    baseURL: "http://ec2-18-221-37-26.us-east-2.compute.amazonaws.com:3333/",
    timeout: 3000
});

export default api;