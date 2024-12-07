import axios from 'axios';


const axiosClient = axios.create({
  baseURL : 'https://online-food-be-5wp4.onrender.com',
  headers:{
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

export default axiosClient;
