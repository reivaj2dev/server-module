const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.env.npm_config_local_prefix, ".env/" + (process.env.NODE_ENV||'development') + ".env"),
});

console.log(process.env.npm_config_local_prefix);
const DIR = path.resolve(process.env.npm_config_local_prefix, process.env.PATH_DEPLOY_APPS)

/*  Obtenemos todos los directorios 
    que hay que desplegar.
*/
function getDirectories(directory) {
  const files = fs.readdirSync(directory);
  // Filtra solo los directorios
  const directories = files.filter(file => {
    return fs.statSync(`${directory}/${file}`).isDirectory() && (fs.existsSync(`${directory}/${file}/package.json`))
  });
  var lista = [];
  directories.forEach(file => {
    try {
      const pkg = require(`${directory}/${file}/package.json`);
      lista.push(pkg)
    }
    catch(err) {
      console.log(err);
    }
  })
  return lista;
}

const list_apps = getDirectories(DIR);

module.exports = {
  list_apps: list_apps
};
