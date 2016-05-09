var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

  var createFiles = function(dossier,nom){
    nom = nom.toLowerCase();
    if(typeof dossier == "undefined" || dossier == null || dossier == ""){
      dossier = "";
    }
    else{
      dossier = (dossier+'/').toLowerCase();
    }
    var absoluteDirname = "app/components/"+dossier+"_widgets/"+nom;
    var dirname = "./"+absoluteDirname;
    var filename = nom.replace(/\//g,'-');
    var className = helpers.camelize(filename);

var componentContent =
`import {Component} from '@angular2/core';
@Component({
  selector: '`+filename+`',
  templateUrl: '`+dirname+'/'+filename+".html"+`',
  styleUrls: ['`+dirname+'/'+filename+`.css']
})
export class `+className+`Component {
  constructor(){
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
`<div></div>`;

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
    console.log("Le widget a été crée ");
    //console.log("N'oubliez pas de rajouter la route dans votre fichier app.ts");
    //console.log("{path: '"+url+"', name: '"+className+"', component: "+className+"}");
  });

    return true;

  };

    if(typeof argv[3] === 'undefined'){
      helpers.askData('Nom du widget? (minuscule et tirets) ',(nom)=>{
        helpers.askData('Dossier specifique? (vide = widget general, exemple: article) ',(dossier)=>{
          createFiles(dossier,nom);
        });
      });
    }
    else{
      createFiles(argv[3]);
    }
  }

}
