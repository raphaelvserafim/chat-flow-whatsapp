const currentProtocol = window.location.protocol;
const currentHost = window.location.host;
const url = currentProtocol.concat("//", currentHost);
const environment = {
  URL_BASE: url,
  API: {
    URL: "http://localhost:8083",
    AUTH: {
      LOGIN: "/v1/oauth",
    },
    FLOW: {
      INFO: "/v1/flow"
    }
  },
  LOCAL_STORAGE: {
  },
  COOKIES: {
    SESSION: "xthex_xflx_xowx",
  },
};

export default environment;