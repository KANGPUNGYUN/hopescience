// api/index.js
import axios from "axios";

function getBaseUrl() {
  const isDevelopment = process.env.REACT_APP_ENV === "development";
  return isDevelopment
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;
}

function getAuthState() {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return {};
    return JSON.parse(raw)?.state ?? {};
  } catch {
    return {};
  }
}

function setAuthState(updates) {
  try {
    const raw = localStorage.getItem("auth-storage");
    const parsed = raw ? JSON.parse(raw) : { state: {} };
    parsed.state = { ...parsed.state, ...updates };
    localStorage.setItem("auth-storage", JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

function clearAuthState() {
  try {
    localStorage.removeItem("auth-storage");
  } catch {
    // ignore
  }
}

function getUserTypeFromSessionStorage() {
  return getAuthState()?.user?.userType ?? null;
}

function assertStaffApiAllowed({ path }) {
  const userType = getUserTypeFromSessionStorage();
  if (userType !== "staff") return;

  const staffAllowedPrefixes = ["/columns"];
  const staffAllowedExact = ["/users/logout", "/users/login", "/users/refresh"];
  const isAllowed =
    typeof path === "string" &&
    (staffAllowedExact.includes(path) ||
      staffAllowedPrefixes.some((prefix) => path.startsWith(prefix)));
  if (!isAllowed) {
    const err = new Error("스태프 계정은 칼럼 관리 기능만 사용할 수 있습니다.");
    err.code = "STAFF_FORBIDDEN";
    throw err;
  }
}

// 동시에 여러 요청이 401을 받아도 refresh를 한 번만 시도하기 위한 상태
let isRefreshing = false;
let pendingQueue = []; // { resolve, reject }[]

function processPendingQueue(error, newToken = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingQueue = [];
}

// 429 알림 디바운스 (연속 호출 시 중복 alert 방지)
let lastRateLimitAlertAt = 0;
function notifyRateLimited(error) {
  const now = Date.now();
  if (now - lastRateLimitAlertAt < 3000) return;
  lastRateLimitAlertAt = now;
  const serverMsg =
    error?.response?.data?.error ||
    error?.response?.data?.detail ||
    "";
  alert(
    `요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.${
      serverMsg ? `\n(${serverMsg})` : ""
    }`
  );
}

// axios 인터셉터 설정
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      notifyRateLimited(error);
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 세션 만료 → 로그아웃
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/users/refresh")
    ) {
      clearAuthState();
      window.location.href = "/signin";
      return Promise.reject(error);
    }

    // 401이고 재시도 전인 경우에만 refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = getAuthState();
      if (!refreshToken) {
        clearAuthState();
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 refresh 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const baseUrl = getBaseUrl();
        const res = await axios.post(
          `${baseUrl}/users/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
              accept: "application/json",
            },
            withCredentials: true,
          }
        );

        const { access_token, refresh_token } = res.data;
        setAuthState({
          accessToken: access_token,
          refreshToken: refresh_token ?? refreshToken,
        });

        processPendingQueue(null, access_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        processPendingQueue(refreshError);
        clearAuthState();
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const send = async ({
  method = "",
  path = "",
  data = {},
  access_token = "",
  headers = {},
} = {}) => {
  const baseUrl = getBaseUrl();
  const url = baseUrl + path;
  assertStaffApiAllowed({ path });

  const token = access_token || getAuthState()?.accessToken || "";
  const defaultHeaders = {
    "content-type": "application/json;charset=UTF-8",
    accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options = {
    method,
    url,
    headers: { ...defaultHeaders, ...headers },
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

const uploadFileApi = ({ path = "", formData, access_token = "" } = {}) => {
  const baseUrl = getBaseUrl();
  const url = baseUrl + path;
  const token = access_token || getAuthState()?.accessToken || "";
  return axios({
    method: "POST",
    url,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    data: formData,
    withCredentials: true,
  }).then((r) => r.data);
};

export { getApi, putApi, postApi, patchApi, deleteApi, uploadFileApi };
