import axios from 'axios';
import Cookies from "js-cookie";
import environment from '@theflow/configs/environment';

const authToken = Cookies.get(environment.COOKIES.SESSION) || "";

const httpService = axios.create({
  baseURL: environment.API.URL,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});


export default httpService;