var helpers = require('../../helpers');

module.exports = {
  generate: function(argv){

    var createFiles = function(url){
      url = url.toLowerCase();
      var dirname = "./app/pipes/"+url;
      var filename = url.replace(/\//g,'-');
      var className = helpers.camelize(filename);

      //console.log(this);

var classContent =
`import {Pipe, PipeTransform} from '@angular2/core';
/*
Exemple: {{ valeur |  `+filename+`:arg1 }}
*/
@Pipe({name: '`+filename+`'})
export class `+className+`Pipe implements PipeTransform {
  transform(value:number, args:string[]) : any {
    //exemple ici pour returner le resultat de la fonction puissance
    return Math.pow(value, parseInt(args[0] || '1', 10) );
  }
}`;

      helpers.createFileIfNotExist(dirname,filename+".ts", classContent);
    };

    if(typeof argv[3] === 'undefined'){
      helpers.askData('Quel nom pour votre pipe (minuscule et tiret)? ',createFiles);
    }
    else{
      createFiles(argv[3]);
    }
  }

}
