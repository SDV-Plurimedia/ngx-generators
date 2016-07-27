var helpers = require('../../helpers');

module.exports = {

    generate: function(argv) {

        var createFiles = function(url, model, api_endpoint) {

            //on mets des valeurs par défaut au besoin
            url = (typeof url !== 'undefined' && url !== "") ? url : "crud/users";
            model = (typeof model !== 'undefined' && model !== "") ? model : "user";
            api_endpoint = (typeof api_endpoint !== 'undefined' && api_endpoint !== "") ? api_endpoint : "GLOBAL_CONFIG.api_url+'/" + model + "'";

            //on s'assure du format
            url = url.toLowerCase();
            model = model.toLowerCase();

            //Pour la page de liste:
            var hierarchy = helpers.getHierarchy(url);
            var absoluteDirname = "app/components/" + url;
            var dirname = "./" + absoluteDirname;
            var filename = url.replace(/\//g, '-');
            var className = helpers.camelize(filename);
            var modelName = helpers.camelize(model);

            var conf = {
                'url': url,
                'api_endpoint': api_endpoint,
                'absoluteDirname': absoluteDirname,
                'hiddenFields': hiddenFields,
                'dirname': dirname,
                'filename': filename,
                'className': className,
                'model': model,
                'modelName': modelName,
                'hierarchy': hierarchy
            }

            var asq = require("async");
            asq.parallel([
                    (cb) => {
                        helpers.getFileAndReplaceOccurences("bin/generator/templates/ngCrud/component.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences("bin/generator/templates/ngCrud/componentEdit.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences("bin/generator/templates/ngCrud/service.ts.base", conf, cb);
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

                var asq = require("async");
                asq.parallel(
                    [
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".ts", componentListContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname + "/edit", filename + "-edit.ts", componentEditContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist("app/services/data", model + ".ts", serviceContent, cb)
                        }
                    ],
                    function() {
                        //aprés avoir tout ecris
                        helpers.askData('Voulez vous regénérer automatiquement les routes? ( y / n) ', (reponse) => {
                            if (reponse == 'y') {
                                var route = require("./route");
                                route.generate();
                                helpers.printSeparator();
                                var filename = url.replace(/\//g, '-');
                                console.log(`N'oubliez pas de rajouter dans app.ts, la route de modification suivante:

                  { path: '` + url + `/edit/:id', component:` + className + `EditComponent, name: '` + className + `EditId' },

                   `);
                            } else {
                                console.log('Ok, Pas de modification de route... :(')
                            }
                        });
                    });
            }
            return true;
        }

        var url = helpers.askDataSync('Quelle URL voulez-vous pour votre page de CRUD? (exemple: crud/users) ');
        var model = helpers.askDataSync('Sur quel modèle se base cette page? (exemple: user) ');
        var api = helpers.askDataSync('A quelle API Laravel voulez-vous vous connecter ( exemple: Route::resource("api-site", ...) => "api-site" )? ');
        var hiddenFields = helpers.askDataSync('Quels champs du modèle souhaitez-vous cacher ? (exemple : "complement,created_at") ');

        helpers.printSeparator();

        createFiles(url, model, api);
    }
}
