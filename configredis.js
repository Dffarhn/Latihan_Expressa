const { createClient } = require('redis');


const client = createClient();

client.on('error',(err) => {

    console.error(err);
})

client.connect();


module.exports = {client};