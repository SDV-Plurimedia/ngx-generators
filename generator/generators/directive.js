var helpers = require('../../helpers');

module.exports = {
  generate: function(argv){

    var createFiles = function(url){
      url = url.toLowerCase();
      var dirname = "./app/directives/";
      var filename = url.replace(/\//g,'-');
      var className = helpers.camelize(filename);

      //console.log(this);

var classContent =
`import {Directive, ElementRef, Renderer, Input} from '@angular/core';

@Directive({
  selector: '[`+filename+`]'
})
export class `+className+`Directive {
  constructor(private _element: ElementRef, private renderer: Renderer) {
      renderer.setElementStyle(_element, 'color', 'red');
  }
}`;

      helpers.createFileIfNotExist(dirname,filename+".ts", classContent);
    };

    if(typeof argv[3] === 'undefined'){
      helpers.askData('Quel nom pour votre directive (minuscule et tiret)?',createFiles);
    }
    else{
      createFiles(argv[3]);
    }
  }

}
