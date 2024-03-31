const { createClient } = require("@vercel/kv");
const dotenv = require("dotenv");
dotenv.config();

const client = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = { client };
