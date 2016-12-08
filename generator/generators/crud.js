var helpers = require('../../helpers');

module.exports = {

    generate: function(argv) {

        //ETAPE 2
        var createFiles = function(url, model) {

            var api_endpoint = helpers.askDataSync('A quelle Url d\'API Laravel voulez-vous vous connecter ( exemple: "pulse/api-site" )? ');
            

            var api_infyom = helpers.askDataSync('Cette api a elle été générée avec Infyom ? (y /n ) ');
            if( api_infyom.toLowerCase() === 'y' ) {
                api_infyom = '.data';
            } else {
                api_infyom = ''
            }

            var hiddenFields = helpers.askDataSync('Quels champs du modèle ne voulez-vous pas afficher dans le formulaire ? (avec virgule, exemple : "complement,created_at") ');

            helpers.printSeparator();

            //on mets des valeurs par défaut au besoin
            url = (typeof url !== 'undefined' && url !== "") ? url : "crud/users";

            model = (typeof model !== 'undefined' && model !== "") ? model : "app/_shared/_models/user-lea";
            let modelPath = model.slice(0);
            model = model.toLowerCase().split('/').pop();

            api_endpoint = (typeof api_endpoint !== 'undefined' && api_endpoint !== "") ? api_endpoint : "pulse/"+model;



            //on s'assure du format
            url = url.toLowerCase();


            //Pour la page de liste:
            var hierarchy = helpers.getHierarchy(url);
            var absoluteDirname = "src/app/_modules/" + url;
            var dirname = "./" + absoluteDirname;
            var filename = url.replace(/\//g, '-');
            var className = helpers.camelize(filename);
            var routeName = helpers.lcfirst(className);
            var modelName = helpers.camelize(model);

            var conf = {
                'url': url,
                'api_endpoint': api_endpoint,
                'api_infyom': api_infyom,
                'absoluteDirname': absoluteDirname,
                'hiddenFields': hiddenFields,
                'dirname': dirname,
                'filename': filename,
                'className': className,
                'routeName': routeName,
                'model': model,
                'modelPath': modelPath,
                'modelName': modelName,
                'hierarchy': hierarchy
            }

            var asq = require("async");
            var generator_templates = __dirname+"/../templates/crud/";
            asq.parallel([
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"componentIndex.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"componentEdit.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"service.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"module.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"component.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"routing.ts.base", conf, cb);
                    }
                ],
                function(err, results) {
                    write(results);
                }
            )

            var write = function(results) {
                var componentListContent = results[0];
                var componentEditContent = results[1];
                var serviceContent = results[2];
                var moduleContent = results[3];
                var componentContent = results[4];
                var routingContent = results[5];

                var asq = require("async");
                asq.parallel(
                    [
                        (cb) => {
                            helpers.createFileIfNotExist(dirname + "/index", "index.ts", componentListContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname + "/edit", "edit.ts", componentEditContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname +"/_services/", model + ".ts", serviceContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".module.ts", moduleContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".component.ts", componentContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".routing.ts", routingContent, cb)
                        }
                    ],
                    function() {
                        //aprés avoir tout ecris
                        helpers.askData('Voulez vous modifier automatiquement le fichier de routes des modules? ( y / n) ', (reponse) => {
                            if (reponse == 'y') {
                                var route = require("./route");
                                route.generate();
                                helpers.printSeparator();
                                var filename = url.replace(/\//g, '-');
                                console.log(`Keep on rolling baby!`);
                            } else {
                                console.log('Ok tanpis, Pas de modification de route... :(')
                            }
                        });
                    });
            }
            return true;
        }




        var url = helpers.askDataSync('Quelle nom voulez-vous pour votre module de CRUD? (minuscule et tiret -, exemple: annuaire-contact) ');

        var rep = helpers.askDataSync('Voulez vous générer un modèle pour votre CRUD? (y / n)');
        if( rep.toLowerCase() == 'y' ){
          var modelName = helpers.askDataSync('Comment voulez-vous nommer votre modèle ? (minuscule et tiret - , exemple: contact)');
          var modelClassName = helpers.ucfirst(helpers.camelize(modelName));
          var ph_field = "//INSERT_FIELD_AUTO";
          var ph_const = "//INSERT_CONSTRUCT_AUTO";
          var modelDir = "src/app/_modules/"+url+"/_models/";

var modelContent =
`export class `+modelClassName+` {
    public _id: string = "";

    `+ph_field+`

    public constructor(obj?: any) {
        this._id = obj && obj._id || null;

        `+ph_const+`

        /*//si vous n'utilisez plus le constructeur de form auto, ou si vous avez fixé la structure, vous pouvez remplacer le contenu de INSERT_CONSTRUCT_AUTO par ça:
        if(typeof obj !== 'undefined'){
        let properties = Object.keys(this);
        properties.forEach((prop) => {
          if (obj[prop] !== undefined && obj[prop] !== null)
            this[prop] = obj[prop];
        });
      }*/

    }
}`
        //boucle d'ajout d'un champ
        var champ = 'y';
        var contient_date = '';
        while(champ.toLowerCase() == 'y'){
          var nom = helpers.askDataSync('Nom du champ ?  (en minuscule et underscore_, exemple: "titre_alt" ) ');
          var type = helpers.askDataSync('Type du champ ?  (exemple: "string","number","boolean","date" ) ');
          var defauval = "null";
          if( type == "number"){
            defauval = "0";
          }
          else if( type == "string"){
            defauval = "''";
          }
          else if( type == "boolean"){
            defauval = "false";
          }
          //WIP -> gestion de date
          else if( type == "date"){
            type = "Date";
            defauval = "new Date(today_str_iso)";
            contient_date = "\n var today_str_iso = today.getFullYear() + '-' + ( today.getMonth() + 1) + '-' + today.getDate();";
          }

          var line_champ = "\n public "+nom+": "+type+" = "+defauval+";";
          modelContent = helpers.afterPlaceHolder(modelContent,ph_field,line_champ);

          var line_const = "\n this."+nom+" = obj && obj."+nom+" || "+defauval+";";
          modelContent = helpers.afterPlaceHolder(modelContent,ph_const,line_const);


          var champ = helpers.askDataSync('Voulez vous ajouter un autre champ (y / n) ? ');
        }

        //si parmis tous les champs on a besoin de gerer une date
        if(contient_date !== ''){
          modelContent = helpers.afterPlaceHolder(modelContent,ph_const,contient_date);
        }

        //quand on a plus de champ a jouter on ecrit le fichier
        helpers.createFileIfNotExist(modelDir, modelName + ".ts", modelContent, ()=>{
          //on passe à la suite en asynchrone
          createFiles(url, modelDir+modelName);
        });


        }
        //si on veut utiliser un model existant
        else{
            var model = helpers.askDataSync('Sur quel modèle existant se base cette page? (exemple: app/_modules/mon_module/_models/user ) ');
            //on passe à la suite en synchrone
            createFiles(url, model);
        }




    }
}
