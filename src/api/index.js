// api/index.js
import axios from "axios";

function getUserTypeFromSessionStorage() {
  try {
    const raw = sessionStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userType ?? null;
  } catch {
    return null;
  }
}

function assertStaffApiAllowed({ path }) {
  const userType = getUserTypeFromSessionStorage();
  if (userType !== "staff") return;

  // staff는 현재 칼럼 관련 API만 허용
  const isAllowed = typeof path === "string" && path.startsWith("/columns");
  if (!isAllowed) {
    const err = new Error("스태프 계정은 칼럼 관리 기능만 사용할 수 있습니다.");
    err.code = "STAFF_FORBIDDEN";
    throw err;
  }
}

const send = async ({
  method = "",
  path = "",
  data = {},
  access_token = "",
  headers = {},
} = {}) => {

  const isDevelopment = process.env.REACT_APP_ENV === 'development';
  const commonUrl = isDevelopment ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;
  const url = commonUrl + path;
  assertStaffApiAllowed({ path });

  const defaultHeaders = {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json",
    Authorization: `Bearer ${access_token}`,
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const options = {
    method,
    url,
    headers: mergedHeaders,
    data,
    withCredentials: true,
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error.message);
    throw error;
  }
};

const getApi = ({ path = "", access_token = "" } = {}) =>
  send({ method: "GET", path, access_token });
const putApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "PUT", path, data, access_token });
const patchApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "PATCH", path, data, access_token });
const postApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "POST", path, data, access_token });
const deleteApi = ({ path = "", data = {}, access_token = "" } = {}) =>
  send({ method: "DELETE", path, data, access_token });

export { getApi, putApi, postApi, patchApi, deleteApi };
