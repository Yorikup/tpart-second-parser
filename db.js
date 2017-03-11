const
  mysql      = require('mysql')
, credentials= require('./credentials.js')  
, DB = "prices"
, connection = mysql.createConnection({
    host     : credentials.host,
    user     : credentials.user,
    password : credentials.password,
    database : DB,
    port     : '3306'
  })
;
module.exports = {
  addItem: function (code, name, priceEuro, price, available) {
    return new Promise(function(resolve, reject) {
      var query = "SELECT `code` FROM `" + DB + "`.`sdf` WHERE `code`='" + code + "'";
      connection.query(query, function(err, rows, fields) {
        if (err) {
          console.log("--------------------------\n" + query + "\n--------------------------\n");
          reject("Ошибка поиска детали " + code);
        } else {
          if(rows.length > 0) {
            var query = "UPDATE `" + DB + "`.`sdf` SET `name`='" + name + "', `priceEuro`='" + priceEuro + "',`price`='" + price + "',`available`='" + available + "' WHERE `code`='" + code + "'";
          } else {
            query = "INSERT INTO `" + DB + "`.`sdf`(`code`, `name`, `priceEuro`, `price`, `available`) VALUES ('" + code + "','" + name + "'," + priceEuro + "," + price + "," + available + ")";
          }
          connection.query(query, function(err, rows, fields) {
            if (err) {
              reject("Ошибка обработки детали " + code + ": " + query);
            } else {
              if (rows.affectedRows === 1) {
                resolve(rows.insertId);
              } else {
                reject("Ошибка обработки детали " + code + ": " + query);
              }
            }
          });
        }
      });
    });
  }
}