import axios from 'axios';

let API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

let Config = (token = localStorage.getItem('token')) => {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

let id = localStorage.getItem('id');


export { API, Config, id };
