const axios = require('axios');

module.exports = {
  check_token: async (req,res,next)=>{
    //check token
    let response = await axios({
      method:'get',
      url:'http://localhost:8084',
      header: {
        sessionID:req.sessionID,
        session:req.session
      }
    });
    let token = response.data;
    next(token);
  },
  main_page: (req,res,next) => {
    res.send('test');
  }
}
