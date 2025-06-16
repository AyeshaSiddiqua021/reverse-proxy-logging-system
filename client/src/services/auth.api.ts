import { BASE_URL, LOGIN, REGISTER } from "@/constants";
import axios from "axios";


export const loginUser = async (email: string, password: string) => {
  const { data } = await axios.post(`${BASE_URL}${LOGIN}`, {
    email,
    password,
  });
  return data;
};

export const registerUser = async (email: string, password: string) => {
  const { data } = await axios.post(`${BASE_URL}${REGISTER}`, {
    email,
    password,
  });
  return data;
};
