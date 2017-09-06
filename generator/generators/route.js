var helpers = require('../../helpers');



module.exports = {


  generate: function(argv){

    console.log('Génération automatique des routes de module');

    var modules = "";
    var importmodules = "";
    var basepath = "src/app/_modules";

    // préparation des includes du module
    var files = helpers.getFileInDirRecursive(basepath);
    files.forEach((file)=>{
      if(
        //on recherche les fichiers de module
        file.indexOf('module.ts') !== -1
        //exclusions
        && file.indexOf('dist') === -1
        && file.indexOf('modules.module') === -1
      ){
          var filename = file.split('/').pop();//juste le nom du fichier
          var module_path = file.replace(basepath,'.').replace(".ts","");
          filename = filename.replace('.module.ts','').replace("mod_",'').replace("_spa",'');
          var className = helpers.camelize(filename);

          modules += className+`Module,
`;
          importmodules += "import {"+className+"Module} from '"+module_path+`';
`;

        }
    });

    var route = "";
    var imports = "";
    // préparation des routes
    files.forEach((file)=>{
      if(
        //on recherche les fichiers de module
        file.indexOf('routing.ts') !== -1
        //exclusions
        && file.indexOf('dist') === -1
        && file.indexOf('modules.routing') === -1
      ){
          var filename = file.split('/').pop();//juste le nom du fichier
          var route_path = file.replace(basepath,'.').replace(".ts","");

          filename = filename.replace('.routing.ts','').replace("mod_",'').replace("_spa",'');
          var className = helpers.camelize(filename);
          var routeName = helpers.lcfirst(className) + "Routes";

          route += `...`+routeName+`,
`;
          imports += `import { `+routeName+` } from '`+route_path+`';
`;
        }
    });

    // préparation des widgets
    var widgets = [];
    var import_widgets = "";
    files.forEach((file)=>{

      var filename = file.split('/').pop();//juste le nom du fichier
      if(
        file.indexOf('widgets.ts') !== -1
        && file.indexOf('dist') == -1
        && file.indexOf('modules.widgets') == -1
      ){
          var widget_path = file.replace(basepath+"/","./").replace(".ts","");
          var className = helpers.camelize(filename.replace(".widgets.ts",""));
          var widgetName = helpers.lcfirst(className) + "Widgets";

            //on crée l'import des widgets
            import_widgets += `import { widgets as `+widgetName+` } from '`+widget_path+`';
`;
            // on stoque un tableau des fichiers widgets
            widgets.push({name: widgetName, path: widget_path});
        }
    });

    // génération des merges de tableau pour chaque fichier widgets
    var art_merge = "";
    var comp_merge = "";
    var comp_popup_merge = "";
    var topic_merge = "";
    var all_meta_merge = "";
    var comp_activite_merge = ""; // les widgets du dashboard

    // Remplacement dans les fichiers

    var modules_base_dir = 'src/app/_modules/';
    var template_modules_dir = __dirname+"/../templates/modules/";

    widgets.forEach(function(widget){
      widget.path = widget.path.replace('./', '') + '.ts';

      helpers.getFile(modules_base_dir + widget.path,(data)=>{

        if (data.toString().indexOf('widgets_article_edition') !== -1) {
          art_merge += `...`+widget.name+`.widgets_article_edition,
`;
        }

        if (data.toString().indexOf('widgets_complement_panel') !== -1) {
          comp_merge += `...`+widget.name+`.widgets_complement_panel,
`;
        }

        if (data.toString().indexOf('widgets_complement_popup') !== -1) {
          comp_popup_merge += `...`+widget.name+`.widgets_complement_popup,
`;
        }

        if (data.toString().indexOf('widgets_topic_edition') !== -1) {
          topic_merge += `...`+widget.name+`.widgets_topic_edition,
`;
        }

        if (data.toString().indexOf('widgets_all_meta') !== -1) {
          all_meta_merge += "..."+widget.name+`.widgets_all_meta,
`;
        }

        if (data.toString().indexOf('widgets_complement_activite') !== -1) {
          comp_activite_merge += `...`+widget.name+`.widgets_complement_activite,
`;
        }
      });

    });

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

    // création du fichier widgets si inexistant
    var widgets_file = "modules.widgets.ts";
    helpers.getFile(template_modules_dir+widgets_file,(data)=>{
      helpers.createFileIfNotExist(modules_base_dir, widgets_file, data, (cb)=>{
        //maj du fichier d'widgets global
        helpers.getFile(modules_base_dir+widgets_file,(data)=>{
          import_widgets = "\n"+import_widgets+"\n";
          var retour = helpers.placeInPlaceHolder(data,"// DEBUT-IMPORT-PLACEHOLDER","// FIN-IMPORT-PLACEHOLDER",import_widgets);

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

          comp_activite_merge = "\n"+comp_activite_merge+"\n";
          var retour = helpers.placeInPlaceHolder(retour, "// DEBUT-WIDGET-COMP-ACTIVITE-PLACEHOLDER", "// FIN-WIDGET-COMP-ACTIVITE-PLACEHOLDER", comp_activite_merge);

          helpers.createFile(modules_base_dir,widgets_file,retour);
        });
      });
    });

    return true;
  }

}