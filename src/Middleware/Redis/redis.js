const { client } = require("../../../configredis.js");


const redisCacheMiddleware = async(req, res, next) => {
  const key = req.originalUrl;

//   client.get(key, (err, cachedData) => {
//     if (err) {
//       console.error('Redis Error:', err);
//       return next(); // Proceed to next middleware or route handler
//     }

//     if (cachedData !== null) {
//       // Data found in cache, send cached data
//       console.log("Data found in Redis cache");
//       res.send(JSON.parse(cachedData));
//     } else {
//       // Data not found in cache, proceed to next middleware or route handler
//       next();
//     }
//   });


    let chechkredis = await client.get(key);

    if (chechkredis) {
        res.send(JSON.parse(chechkredis));
        
    }else{
        next();
    }


};

module.exports = { redisCacheMiddleware };