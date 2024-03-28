const fs = require('fs');
const http = require('http');
const url = require('url');

// TEMPLATES
temp_overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
temp_card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
temp_product = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

// Getting Data
const data_json = fs.readFileSync(`${__dirname}/json/data.json`, 'utf-8');
const parsedData = JSON.parse(data_json);

//Filling Templates
const replaceTemplate = (temp, data) => {
  let output;
  output = temp.replace(/{%PRODUCTNAME%}/gi, data.productName);
  output = output.replace(/{%FROM%}/gi, data.from);
  output =output.replace(/{%ID%}/gi, data.id);
  output =output.replace(/{%IMAGE%}/gi, data.image);
  output =output.replace(/{%PRICE%}/gi, data.price);
  output =output.replace(/{%RECIPE%}/gi, data.recipe);
  output =output.replace(/{%DESCRIPTION%}/gi, data.description);

  return output;
} 

const server = http.createServer((req, res) => {
const pathName = url.parse(req.url).pathname;

  if(pathName === '/' || pathName === '/overview') {
    const data = parsedData.map(el => replaceTemplate(temp_card, el));

    const data2 = temp_overview.replace(/{%INSERT_CARD%}/, data.join(''));    
    res.writeHead(200, {
      "content-type": "text/html"
    })
    res.end(data2);
  }
  
  else if(pathName === '/product') {
    const id = url.parse(req.url).query.split('').filter(el => {
      return !isNaN(el);
    });

    const output2 = replaceTemplate(temp_product, parsedData[parseFloat(id.join())]);

    res.writeHead(200, {
      "content-type": "text/html"
    })
    res.end(output2);
  }

  else {
    res.end('FILE NOT FOUND!!');
  }
});


server.listen(8000, '127.0.0.1', ()=> {
  console.log('Listening to requests...')
})

