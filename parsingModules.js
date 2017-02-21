var request = require("request"),
    cheerio = require("cheerio");

/* tablePart object description */
var tablePart = function(partName, partCode, partPrice, partInStock) {
  this.name = partName;
  this.code = partCode;
  this.price = partPrice;
  this.inStock = partInStock;
}

tablePart.prototype.getPart = function() {
  return {name: this.name, code: this.code, price: this.price, inStock: this.inStock}
}

tablePart.prototype.setPartName = function(partName) {
  this.name = partName;
  return true;
}

tablePart.prototype.setPartCode = function(partCode) {
  this.code = partCode;
  return true;
}

tablePart.prototype.setPartPrice = function(partPrice) {
  this.price = partPrice;
  return true;
}

tablePart.prototype.setPartInStock = function(partInStock) {
  this.inStock = partInStock;
  return true;
}
/* tablePart object description end */

module.exports = {
  getTableParts: function(tableUrl, stringSelector) {
    var tableParts = [];
    var options = {
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': 'PHPSESSID=5bcs4s2h6tjcj4ga4boncrkc70'
      }
    };
    return new Promise(function(resolve, reject) {
      request.get(tableUrl, options, function(error, response, body){
        if(!error) {
          var $ = cheerio.load(body, {decodeEntities: false});
          //console.log(($).html());
          var table = $(stringSelector).html();
          console.log(table);
        } else {
          reject(error);
          console.log("Произошла ошибка: " + error);
        }
      });
    });
  }
}