const dotenv = require('dotenv');
dotenv.config();

const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['api-key'];
  
    if (apiKey && apiKey === process.env.API_KEY) {
      next(); // API key is valid, proceed to next middleware
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

module.exports = {checkApiKey}