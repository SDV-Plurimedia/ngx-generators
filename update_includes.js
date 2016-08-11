#!/usr/bin/env node
var helpers = require('./helpers');

//script de creation publication des includes
var includes_front = [
  "node_modules/tether/dist/css/tether.min.css",
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "node_modules/bootstrap/dist/css/bootstrap.css.map",
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/tether/dist/js/tether.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.min.js",
  "node_modules/bootbox/bootbox.min.js",
  "node_modules/moment/min/moment-with-locales.js",
  //new
  "node_modules/zone.js/dist/zone.min.js",
  "node_modules/bootstrap-notify/bootstrap-notify.min.js",
  "node_modules/bootbox/bootbox.min.js",
  "node_modules/raphael/raphael.min.js",
  "node_modules/morris.js/morris.css",
  "node_modules/morris.js/morris.min.js",
  "node_modules/jquery-knob/dist/jquery.knob.min.js",
  "node_modules/datatables.net/js/jquery.dataTables.js",
  "node_modules/datatables.net-bs/js/dataTables.bootstrap.js",
  "node_modules/datatables.net-bs/css/dataTables.bootstrap.css",
  "node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js",
  "node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css"

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
