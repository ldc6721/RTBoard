const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

//error handling
client.on("error",(error)=>{
  console.error(error);
});

module.exports = {
  get_session_data: async (sessionID)=>{
    try {
      let response = await getAsync(`sess:${sessionID}`);
      return JSON.parse(response);
    } catch (e) {
      console.error(e);
    }
  }
}
