var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

    console.log('Génération automatique des routes de page');

    var route = "";
    var imports = "";

    var files = helpers.getFileInDirRecursive("app/components");
    files.forEach((file)=>{

      var filename = file.split('/').pop();//juste le nom du fichier
      if(
        file.indexOf('_widgets') == -1 //on ignore les widgets
        && file !== 'app/components/app.ts' //on ignore l'app
        && file !== 'app/components/home.ts' //on ignore la home
        && file.indexOf('.ts') !== -1
      ){

          var path = file.replace("app/components","").replace("/"+filename,"");
          var componentpath = file.replace("app/components/","./").replace(".ts","");
          var distcomponentpath = componentpath.replace("./","./dist/components");
          var className = helpers.camelize(filename.replace(".ts",""));

route += `
{
  path: '`+path+`',
  component: `+className+`Component,
  /*component: ComponentProxyFactory({
    path: '`+distcomponentpath+`',
    provide: m => m.`+className+`Component
  }),*/
  name: '`+className+`'
},`;

imports += `import {`+className+`Component} from '`+componentpath+`';
`;

        }
    });


    helpers.getFile('app/components/app.ts',(data)=>{
      var ph_debut = "//ROUTE AUTOMATIQUE DEBUT\n";
      var ph_fin= "\n//ROUTE AUTOMATIQUE FIN";
      var retour = helpers.placeInPlaceHolder(data,ph_debut,ph_fin,route);

      var phi_debut = "//IMPORT AUTOMATIQUE DEBUT\n";
      var phi_fin= "\n//IMPORT AUTOMATIQUE FIN";
      var retour = helpers.placeInPlaceHolder(retour,phi_debut,phi_fin,imports);



      console.log("re-ecriture du fichier app/components/app.ts");
      helpers.createFile("app/components/","app.ts",retour);
    });

    return true;
  }

}
