const { client } = require("../../../configredis.js");

const redisCacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  let chechkredis = await client.get(key);
  console.log(chechkredis);

  if (chechkredis) {
    res.send(chechkredis);
  } else {
    console.log("miss");
    next();
  }
};

module.exports = { redisCacheMiddleware };
