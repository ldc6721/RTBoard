module.exports = (method,url,data,headers,session) => {
  let config = {
    method: method,
    url:url,
    data: data,
    headers: {
      session:JSON.stringify(session),
    }
  };
  if(headers.referer) {
    config.headers.referer = headers.referer;
  };
  return config;
}
