import * as Api from "../api";
export const fetchNetworkRandomUsers = async () => {
  const response = await Api.get("/users/network");
  return response;
};
export const getUInfo = async ({ userId }) => {
  const response = await Api.get(`/users/yourpage/${userId}`);

  return response;
};
