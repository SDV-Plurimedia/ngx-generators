#!/usr/bin/env node
'use strict';

// Provide a title to the process in `ps`
process.title = 'ng2-generators';

//Generateur de script ts (à lancer avec node > 5)
const helpers = require('../helpers');
const fs = require('fs');
const installPath = "./generator/generators/";

//lister les arguments
/*process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});*/
helpers.printSeparator();
console.log(" GENERATEUR DE CODE ANGULAR2 ");

if(process.argv.length == 2){
  helpers.printSeparator();
  //Afficher la liste des générateurs existant
  console.log("Liste des générateurs dispo:");
  fs.readdir(installPath, function(err, items) {
      for (var i=0; i<items.length; i++) {
          console.log(' - '+items[i].split('.').shift());
      }
      console.log(' ');
      helpers.askData('Que voulez vous générer? ',generateType);
  });
}
else{
  generateType(process.argv[2]);
}

function generateType(type){
  helpers.printSeparator();
  //verifie l'existence du fichier
  try{
    fs.accessSync(installPath+type+".js");
    var generator = require("./generators/"+type);
    //console.log(generator);
    generator.generate(process.argv);
  }
  catch(e){
    console.log(" le generateur de "+type+" n'existe pas ");
    console.log(e.stack);
  }

}
