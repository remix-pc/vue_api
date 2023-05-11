var db = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'Gui@bosch2023',
      database : 'api_users'
    }
  });

module.exports = db