var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

    console.log('Génération automatique des routes de module');

    var route = "";
    var imports = "";
    var modules = "";
    var importmodules = "";
    var basepath = "src/app/_modules";

    var files = helpers.getFileInDirRecursive(basepath);
    files.forEach((file)=>{

      var filename = file.split('/').pop();//juste le nom du fichier
      if(
        file.indexOf('routing.ts') !== -1
        && file.indexOf('dist') == -1
        && file.indexOf('modules.module') == -1
        && file.indexOf('modules.routing') == -1
      ){
          var path = file.replace(basepath,"").replace("/"+filename,"");
          var componentpath = file.replace(basepath+"/","./").replace(".ts","");
          var className = helpers.camelize(filename.replace(".routing.ts",""));
          var routeName = helpers.lcfirst(className) + "Routes";

route += `...`+routeName+`,
`;

imports += `import { `+routeName+` } from "`+componentpath+`";
`;

modules += className+`Module,
`;

importmodules += "import {"+className+"Module} from '"+file.replace("src/app/_modules",'.').replace("routing.ts","module")+`';
`;

        }
    });

    var moduleroutingdir = 'src/app/_modules/';
    var moduleroutingname = 'modules.routing.ts';
    var moduleroutingpath = moduleroutingdir+moduleroutingname;
    var modulefilename = "modules.module.ts";
    var modulefilepath = moduleroutingdir+modulefilename;

    //maj du fichier de route
    helpers.getFile(moduleroutingpath,(data)=>{
      route = "\n"+route+"\n";
      var ph_debut = "// ROUTE INCLUES AUTOMATIQUEMENT";
      var ph_fin= "// FIN ROUTES INCLUES AUTOMATIQUEMENT";
      var retour = helpers.placeInPlaceHolder(data,ph_debut,ph_fin,route);

      imports = "\n"+imports+"\n";
      var phi_debut = "// IMPORT INCLUS AUTOMATIQUEMENT";
      var phi_fin= "// FIN IMPORT INCLUS AUTOMATIQUEMENT";
      var retour = helpers.placeInPlaceHolder(retour,phi_debut,phi_fin,imports);

      helpers.createFile(moduleroutingdir,moduleroutingname,retour);
    });

    //maj du fichier de module
    helpers.getFile(modulefilepath,(data)=>{
      importmodules = "\n"+importmodules+"\n";
      var ph_debut = "// IMPORT INCLUS AUTOMATIQUEMENT";
      var ph_fin= "// FIN IMPORT INCLUS AUTOMATIQUEMENT";
      var retour = helpers.placeInPlaceHolder(data,ph_debut,ph_fin,importmodules);

      modules = "\n"+modules+"\n";
      var phi_debut = "// MODULE INCLUS AUTOMATIQUEMENT";
      var phi_fin= "// FIN MODULE INCLUS AUTOMATIQUEMENT";
      var retour = helpers.placeInPlaceHolder(retour,phi_debut,phi_fin,modules);

      helpers.createFile(moduleroutingdir,modulefilename,retour);
    });

    return true;
  }

}
