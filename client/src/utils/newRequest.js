import axios from "axios";


export const newRequest = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
  });
export default newRequest ;