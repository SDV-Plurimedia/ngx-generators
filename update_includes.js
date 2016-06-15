#!/usr/bin/env node
var helpers = require('./helpers');

//script de creation publication des includes
var includes_front = [
  "node_modules/tether/dist/css/tether.min.css",
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/tether/dist/js/tether.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.js",
  "node_modules/bootbox/bootbox.js",
  "node_modules/moment/min/moment-with-locales.js"
];

helpers.printSeparator();
console.log(" MISE A JOUR DES FICHIERS INCLUDES DU INDEX.HTML ");
console.log(" copie depuis /node_modules vers /includes ");
helpers.printSeparator();

//pour chaque url du tableau
includes_front.forEach(function(source){

  //on remplace node_modules par includes pour creer la destination
  var destination = source.replace("node_modules","includes");
  var dest_dir = destination.split('/');
  var dest_file = dest_dir.pop();
  dest_dir = dest_dir.join('/');
  console.log(source + " => " + destination);
  //on crée recursivement dossier et fichier de destination
  helpers.createFileIfNotExist(dest_dir,dest_file,"", function(err){
    //puis on copie le fichier
    helpers.copyFile(source,destination);
  });
});

helpers.printSeparator();
