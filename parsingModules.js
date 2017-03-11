var request = require("request"),
    cheerio = require("cheerio"),
    fs = require("fs"),

    nameSelector = "div.title-indent span",
    codeSelector = "div.title-indent div span",
    priceSelector = "div#productPrice4063 span",
    availableSelector = "div.product_stock span";

/* tablePart object description */
var tablePart = function(partName, partCode, partPriceEuro, partPrice, partAvailable) {
  this.name = partName;
  this.code = partCode;
  this.priceEuro = partPriceEuro;
  this.price = partPrice;
  this.available = partAvailable || '0';
}

tablePart.prototype.getPart = function() {
  return {name: this.name, code: this.code, priceEuro: this.priceEuro, price: this.price, available: this.available}
}

tablePart.prototype.setPartName = function(partName) {
  this.name = partName;
  return true;
}

tablePart.prototype.setPartCode = function(partCode) {
  this.code = partCode;
  return true;
}

tablePart.prototype.setPartPriceEuro = function(partPriceEuro) {
  this.priceEuro = partPriceEuro;
  return true;
}

tablePart.prototype.setPartPrice = function(partPrice) {
  this.price = partPrice;
  return true;
}

tablePart.prototype.setPartAvailable = function(partAvailable) {
  this.available = partAvailable;
  return true;
}
/* tablePart object description end */

module.exports = {

  /* Function that takes all the parts from the current page and pushes them into tableParts array */
  getTableParts: function(tableUrl, stringSelector) {
    var tableParts = [];
    var options = {
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': 'PHPSESSID=89nhngonsdh392i5sk3hncvuk2'
      }
    };
    return new Promise(function(resolve, reject) {
      request.get(tableUrl, options, function(error, response, body){
        if(!error) {
          var $ = cheerio.load(body, {decodeEntities: false});
          var table = $(stringSelector);
          table.children(".row.odd").each(function(i, div){
            partName = $(div).find(nameSelector).html().toLowerCase().trim();
            partCode = $(div).find(codeSelector).html().trim();
            $(div).find(priceSelector).each(function(j, span){
              if (j == 0) {
                partPriceEuro = $(span).html().trim().replace('&euro;', '');
                partPrice = '0.00';
              } else {
                partPrice = $(span).html().trim().replace(' руб.', '');
              }
            });
            partAvailable = $(div).find(availableSelector).html();
            tableParts.push(new tablePart(partName, partCode, partPriceEuro, partPrice, partAvailable));
          });
          resolve(tableParts);
        } else {
          reject(error);
          console.log("Произошла ошибка: " + error);
        }
      });
    });
  },

  /* function that saves an object to a file */
  savePartsPage: function (object, filename) {
    fs.writeFile(filename, JSON.stringify(object), function (error) {
      if (error) {
       return console.log("Произошла ошибка записи в файл " + filename + ": " + error);
      } else {
        console.log("Данные со страницы записаны в файл: " + filename);
      }
    });
  }
}