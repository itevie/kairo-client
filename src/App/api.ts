import { AxiosWrapper } from "../dawn-ui/util";
import { apiUrl } from "../Pages/Login";
import ServerApiManager from "./api_managers/Server";

const axiosClient = new AxiosWrapper();
axiosClient.showLoader = false;
axiosClient.config.withCredentials = true;
axiosClient.config.headers = {
  Authorization: "Bearer Guest",
};
axiosClient.config.baseURL = `${apiUrl}`;

const api = new ServerApiManager(axiosClient);
export default api;
