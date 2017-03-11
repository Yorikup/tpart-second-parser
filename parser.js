var request = require("request"),
    cheerio = require("cheerio"),
    fs = require("fs"),

    db = require("./db.js"),
    credentials = require("./credentials.js"),
    parsingModules = require("./parsingModules.js"),

    stringSelector = "div.browse-view",
    tableUrl = credentials.url,

    getContentErrorCounter = 0;

if( !fs.existsSync('Pages') )
  fs.mkdirSync('Pages');

console.log("\n\n\n\n\n\n\n\n  СТАРТ \n\n");

parseTable(1);

function parseTable(pageNumber) {
  parsingModules.getTableParts(tableUrl + pageNumber, stringSelector).then(
    response => {
      if(response.length > 0) {
        console.log("Данные со страницы " + pageNumber + " получены.");
        getContentErrorCounter = 0;
        addRowToDB(response, 0);
        function addRowToDB(response, counter){
          code = response[counter].code.toString();
          name = response[counter].name.replace('&quot;', '\"').replace('\'', '\\\'');
          priceEuro = response[counter].priceEuro.replace(',', '.').replace('Цены нет', '0.00').replace(' ', '') || '0';
          price = response[counter].price.replace(' ', '');
          available = response[counter].available.trim() || '0';
          db.addItem(code, name, priceEuro, price, available).then(
            answer =>{
              if (counter < (response.length - 1)) {
                //console.log(counter);
                //console.log(response.length);
                counter++;
                addRowToDB(response, counter);
              } else {
                console.log("Страница " + pageNumber + " успешно добавлена в базу данных!");
                if(pageNumber !== 2){
                  pageNumber++;
                  parseTable(pageNumber);
                } else {
                  console.log("\n\n\n\n\n\n\n\n  ПАРСИНГ ОКОНЧЕН!!! \n\n");
                }
              }
            },
            error => {
              console.log(error);
              console.log("Принудительное завершение программы");
              process.exit(-1);
            }
          );  
        }
      } else {
        if(getContentErrorCounter < 3) {
          getContentErrorCounter++;
          console.log("Повторно собираем запчасти со страницы " + pageNumber);
          if(getContentErrorCounter < 2) { parseTable(pageNumber); } else { setTimeout( function () {parseTable(pageNumber)}, 3000); }
        } else {
          console.log("Соединение с сайтом разорвано");
        };
      }
    },
    error => {
      console.log("Ошибка сбора запчастей на странице " + pageNumber);
      if(getContentErrorCounter < 3) {
        getContentErrorCounter++;
        console.log("Повторно собираем запчасти со страницы" + pageNumber);
        if(getContentErrorCounter < 2) { parseTable(pageNumber); } else { setTimeout( function () {parseTable(pageNumber)}, 3000); }
      } else {
        console.log("Соединение с сайтом разорвано");
      };
    }
  );
}