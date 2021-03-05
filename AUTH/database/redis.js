const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");

//error handling
client.on("error",(error)=>{
  console.error(error);
});

//client.set("key","value",redis.print);
//client.get("key",redis.print);

module.exports = {
  set_login_data:(sessionID,id,uid,admin)=>{
    try {
      //set data
      let input = {
        id:id,
        uid:uid
      };
      if(admin) {
        //if admin
        input.admin = admin;
      };
      client.get(`sess:${sessionID}`,(err,res)=>{
        if(err) throw err;
        let data = JSON.parse(res);
        data.login = input;
        client.set(`sess:${sessionID}`,JSON.stringify(data));
      });

      return "success";
    } catch (e) {
      console.error(e);
      return "fail";
    }
  }
}
