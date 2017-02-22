var request = require("request"),
    cheerio = require("cheerio"),
    nameSelector = "div.title-indent span",
    codeSelector = "div.title-indent div span",
    priceSelector = "div#productPrice4063 span",
    inStockSelector = "div.product_stock span";

/* tablePart object description */
var tablePart = function(partName, partCode, partPrice, partInStock) {
  this.name = partName;
  this.code = partCode;
  this.price = partPrice;
  this.inStock = partInStock || '0';
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
          'Cookie': 'PHPSESSID=qpu71d78hhkgfluhejvd069m72'
      }
    };
    return new Promise(function(resolve, reject) {
      request.get(tableUrl, options, function(error, response, body){
        if(!error) {
          var $ = cheerio.load(body, {decodeEntities: false});
          var table = $(stringSelector); //.html();
          //console.log(table);
          table.children(".row.odd").each(function(i, div){
            partName = $(div).find(nameSelector).html();
            console.log(partName);
            partCode = $(div).find(codeSelector).html();
            console.log(partCode);
            partPrice = $(div).find(priceSelector).html().trim();
            console.log(partPrice);
            partInStock = $(div).find(inStockSelector).html();
            console.log(partInStock);
            //console.log($(div).html());
            console.log("i=" + i);
          });
        } else {
          reject(error);
          console.log("Произошла ошибка: " + error);
        }
      });
    });
  }
}