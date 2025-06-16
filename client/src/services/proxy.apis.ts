import { ADD_PROXY_TO_WHISHLIST, BASE_URL, GET_PROXY_LOGS,  TOGGLE_PROXY_LOG } from "@/constants";
import axios from "axios";


const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
};
export const getProxyLogs = () =>
  axios.get(`${BASE_URL}${GET_PROXY_LOGS}`, {
    headers: getAuthHeader(),
  });

export const requestProxy = () =>
  axios.get(`${BASE_URL}/proxy/users`, {
    headers: getAuthHeader(),
  });

export const toggleLogging = (enabled: boolean) =>
  axios.put(
    `${BASE_URL}${TOGGLE_PROXY_LOG}`,
    { enabled },
    { headers: getAuthHeader() }
  );

export const toggleWhitelist = (endpoint: string, whitelisted: boolean) =>
  axios.put(
    `${BASE_URL}${ADD_PROXY_TO_WHISHLIST}`,
    { endpoint, whitelisted },
    { headers: getAuthHeader() }
  );
