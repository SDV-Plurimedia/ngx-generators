var helpers = require('../../helpers');

module.exports = {
  generate: function(argv){

    var createFiles = function(url){
      url = url.replace(/ /g,'-').toLowerCase();
      var dirname = "./app/services/";
      var filename = url.replace(/\//g,'-');
      var className = helpers.camelize(filename);

      //console.log(this);

var classContent =
`import {Injectable} from '@angular2/core';
//import {Hero} from './hero';
//import {HEROES} from './mock-heroes';
@Injectable()
export class `+className+`Service {
  //heroes: Hero[];

  constructor() {
    //this.heroes = HEROES;
  }
  /*getHeroes() {
    return this.heroes;
  }*/
}`;

      helpers.createFileIfNotExist(dirname,filename+".ts", classContent);
    };

    if(typeof argv[3] === 'undefined'){
      helpers.askData('Quel nom pour votre service ? ',createFiles);
    }
    else{
      createFiles(argv[3]);
    }
  }

}
