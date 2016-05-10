var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

  var createFiles = function(url){
    url = url.toLowerCase();
    var absoluteDirname = "app/components/"+url;
    var dirname = "./"+absoluteDirname;
    var filename = url.replace(/\//g,'-');
    var className = helpers.camelize(filename);

var componentContent =
`import {Component, Host} from '@angular/core';
@Component({
  selector: '`+filename+`',
  templateUrl: '`+dirname+'/'+filename+".html"+`',
  styleUrls: ['`+dirname+'/'+filename+`.css']
})
export class `+className+`Component {
  constructor(@Host() private parent: any){
  }
  ngOnInit() {
    // Properties are resolved
  }
  ngOnDestroy() {
    // Speak now or forever hold your peace
  }
  ngDoCheck() {
    // Custom change detection
  }
  ngOnChanges(changes) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
  }
  ngAfterContentInit() {
    // Component content has been initialized
  }
  ngAfterContentChecked() {
    // Component content has been Checked
  }
  ngAfterViewInit() {
    // Component views are initialized
  }
  ngAfterViewChecked() {
    // Component views have been checked
  }
}`;

var htmlContent =
`<div class='row'></div>`;

var cssContent =
`/*CSS*/`;

  var asq = require("async");
  asq.parallel(
    [
      (cb)=>{helpers.createFileIfNotExist(dirname,filename+".ts", componentContent,cb)},
      (cb)=>{helpers.createFileIfNotExist(dirname,filename+".html", htmlContent,cb)},
      (cb)=>{helpers.createFileIfNotExist(dirname,filename+".css", cssContent,cb)}
    ],function(){
    //aprés avoir tout ecris
    //console.log("N'oubliez pas de rajouter la route dans votre fichier app.ts");
    //console.log("{path: '"+url+"', name: '"+className+"', component: "+className+"Component }");
    helpers.askData('Voulez vous regénérer automatiquement les routes? ( y / n) ',(reponse)=>{
      if(reponse=='y'){
        var route = require("./route");
        route.generate();
      }
      else{
        console.log('Ok, Pas de modification de route...')
      }
    });
  });

    return true;

  };


    if(typeof argv[3] === 'undefined'){
      helpers.askData('Quel url voulez vous pour votre page? ',createFiles);
    }
    else{
      createFiles(argv[3]);
    }
  }

}
