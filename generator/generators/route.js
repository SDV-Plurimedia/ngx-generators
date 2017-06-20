var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

    console.log('Génération automatique des routes de module');

    var route = "";
    var imports = "";
    var modules = "";
    var importmodules = "";
    var basepath = "src/app/_modules";

    // préparation des includes et des routes
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

    // préparation des widgets
    var env = [];
    var env_import = "";

    var files = helpers.getFileInDirRecursive(basepath);
    files.forEach((file)=>{

      var filename = file.split('/').pop();//juste le nom du fichier
      if(
        file.indexOf('widgets.ts') !== -1
        && file.indexOf('dist') == -1
        && file.indexOf('modules.widgets') == -1
      ){
          var path = file.replace(basepath,"").replace("/"+filename,"");
          var componentpath = file.replace(basepath+"/","./").replace(".ts","");
          var baseName = helpers.camelize(filename.replace(".widgets.ts",""));
          var envName = helpers.lcfirst(baseName) + "Widgets";

            //on crée l'import des env
            env_import += `import { widgets as `+envName+` } from '`+componentpath+`';
`;
            // on stoque un tableau des fichiers env
            env.push(envName);
        }
    });

    // génération des merges de tableau pour chaque fichier env
    var art_merge = "";
    var comp_merge = "";
    var comp_popup_merge = "";
    var topic_merge = "";
    var all_meta_merge = "";
    env.forEach(function(nom_env){
      art_merge += `...`+nom_env+`.widgets_article_edition,
`;
      comp_merge += `...`+nom_env+`.widgets_complement_panel,
`;
      comp_popup_merge += `...`+nom_env+`.widgets_complement_popup,
`;
      topic_merge += `...`+nom_env+`.widgets_topic_edition,
`;
      all_meta_merge = "..."+nom_env+`.widgets_all_meta,
`;
    });

    // Remplacement dans les fichiers

    var modules_base_dir = 'src/app/_modules/';
    var template_modules_dir = __dirname+"/../templates/modules/";

    // création du fichier route si inexistant
    var routing_file = 'modules.routing.ts';
    helpers.getFile(template_modules_dir+routing_file,(data)=>{
      helpers.createFileIfNotExist(modules_base_dir, routing_file, data, (cb) => {
        //maj du fichier de route
        helpers.getFile(modules_base_dir+routing_file,(data)=>{
          route = "\n"+route+"\n";
          var ph_debut = "// ROUTE INCLUES AUTOMATIQUEMENT";
          var ph_fin= "// FIN ROUTES INCLUES AUTOMATIQUEMENT";
          var retour = helpers.placeInPlaceHolder(data,ph_debut,ph_fin,route);

          imports = "\n"+imports+"\n";
          var phi_debut = "// IMPORT INCLUS AUTOMATIQUEMENT";
          var phi_fin= "// FIN IMPORT INCLUS AUTOMATIQUEMENT";
          var retour = helpers.placeInPlaceHolder(retour,phi_debut,phi_fin,imports);

          helpers.createFile(modules_base_dir,routing_file,retour);
        });
      });
    });

    // création du fichier module si inexistant
    var module_file = "modules.module.ts";
    helpers.getFile(template_modules_dir+module_file,(data)=>{
      helpers.createFileIfNotExist(modules_base_dir, module_file, data, (cb)=>{
        //maj du fichier de module
        helpers.getFile(modules_base_dir+module_file,(data)=>{
          importmodules = "\n"+importmodules+"\n";
          var ph_debut = "// IMPORT INCLUS AUTOMATIQUEMENT";
          var ph_fin= "// FIN IMPORT INCLUS AUTOMATIQUEMENT";
          var retour = helpers.placeInPlaceHolder(data,ph_debut,ph_fin,importmodules);

          modules = "\n"+modules+"\n";
          var phi_debut = "// MODULE INCLUS AUTOMATIQUEMENT";
          var phi_fin= "// FIN MODULE INCLUS AUTOMATIQUEMENT";
          var retour = helpers.placeInPlaceHolder(retour,phi_debut,phi_fin,modules);

          helpers.createFile(modules_base_dir,module_file,retour);
        });
      });
    });

    // création du fichier env si inexistant
    var env_file = "modules.widgets.ts";
    helpers.getFile(template_modules_dir+env_file,(data)=>{
      helpers.createFileIfNotExist(modules_base_dir, env_file, data, (cb)=>{
        //maj du fichier d'env global
        helpers.getFile(modules_base_dir+env_file,(data)=>{
          env_import = "\n"+env_import+"\n";
          var retour = helpers.placeInPlaceHolder(data,"// DEBUT-IMPORT-PLACEHOLDER","// FIN-IMPORT-PLACEHOLDER",env_import);

          art_merge = "\n"+art_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour,"// DEBUT-WIDGET-ARTICLE-PLACEHOLDER","// FIN-WIDGET-ARTICLE-PLACEHOLDER",art_merge);

          comp_merge = "\n"+comp_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour,"// DEBUT-WIDGET-COMP-PANEL-PLACEHOLDER","// FIN-WIDGET-COMP-PANEL-PLACEHOLDER",comp_merge);

          comp_popup_merge = "\n"+comp_popup_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour,"// DEBUT-WIDGET-COMP-POPUP-PLACEHOLDER","// FIN-WIDGET-COMP-POPUP-PLACEHOLDER",comp_popup_merge);

          topic_merge = "\n"+topic_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour,"// DEBUT-WIDGET-TOPIC-PLACEHOLDER","// FIN-WIDGET-TOPIC-PLACEHOLDER",topic_merge);

          all_meta_merge = "\n"+all_meta_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour,"// DEBUT-WIDGET-ALL-META-PLACEHOLDER","// FIN-WIDGET-ALL-META-PLACEHOLDER",all_meta_merge);

          helpers.createFile(modules_base_dir,env_file,retour);
        });
      });
    });

    return true;
  }

}
