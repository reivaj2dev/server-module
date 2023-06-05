const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helpers = require("helpers");
const app = express();
var fs = require('fs');
var https = require('https');

dotenv.config({
  path: path.resolve(process.env.npm_config_local_prefix, ".env/" + (process.env.NODE_ENV||'development') + ".env"),
});

function listen(server, isSSL) {
  var server = server.listen(process.env.PORT, function (err) {
    if (err) throw err;
    let host = server.address().address;
    let port = server.address().port;
    let protocol = isSSL ? 'https' : 'http'
    console.log("Pool de aplicaciones escuchando en %s://%s:%s", protocol, host, port);
  });  
}

const { list_apps } = require("./apps");



console.log("Desplegando aplicaciones...");
list_apps.forEach(({ url, index, desc, name, activo }) => {
  try {
    if (activo) {
      console.log(`\tDesplegando aplicación ${name}`);
      app.use(url, require(path.resolve(process.env.npm_config_local_prefix, index)).app);
      console.log(`\tAplicación ${name} desplegada`);
    }
  } catch (exception) {
    console.log(`\tAplicación ${name} no desplegada`);
    console.log(exception);
  }
});

if ("SSL_PEM_FILE" in process.env && process.env.SSL_PEM_FILE != "") {
  const options = {
    pfx: fs.readFileSync(process.env.SSL_PEM_FILE),
    passphrase: helpers.crypto.decrypt(process.env.SSL_PEM_PASSWORD)
  }
  var server = https.createServer(options, app);
  listen(server, true);
}
else {
  listen(app, false);
}

