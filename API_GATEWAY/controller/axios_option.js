module.exports = (method,url,data,headers,session,sessionID) => {
  let config = {
    method: method,
    url:url,
    data: data,
    headers: {
      session:JSON.stringify(session),
      sessionID:sessionID
    }
  };
  if(headers.referer) {
    config.headers.referer = headers.referer;
  };
  return config;
}
