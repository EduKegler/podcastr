import axios from "axios";

const api = axios.create({
    baseURL: 'https://edukegler-podcastr-api.herokuapp.com/'
});

export default api;