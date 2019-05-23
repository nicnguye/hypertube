let AuthenticationToken = require('../models/AuthenticationToken');

module.exports = function checkLog() {
  return async function (req, res, next) {
    let token = req.body.token;

      if (!token)
        return res.status(203).send('No token found');
      let tokenExists = await AuthenticationToken.findOne({token: token});
      if (!tokenExists)
        return res.status(203).send('Token doesn\'t exists');
      else {
        req.user = tokenExists.userId;
        next();
      }
  }
}
