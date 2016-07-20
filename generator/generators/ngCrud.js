var helpers = require('../../helpers');

module.exports = {

    generate: function(argv) {

        var replaceAll = function(str, find, replace) {
            // définit comment les balises des templates doivent être récupéré (ex: ~~modelName~~)
            var baliseTpl = "~~";
            var find = baliseTpl + find + baliseTpl;

            return str.replace(new RegExp(find, 'g'), replace);
        }

        var createFiles = function(url, model, api_endpoint) {
            //on mets des valeurs par défaut au besoin
            url = (typeof url !== 'undefined' && url !== "") ? url : "crud/users";
            model = (typeof model !== 'undefined' && model !== "") ? model : "user";
            api_endpoint = (typeof api_endpoint !== 'undefined' && api_endpoint !== "") ? api_endpoint : "GLOBAL_CONFIG.api_url+'/" + model + "'";

            //on s'assure du format
            url = url.toLowerCase();
            model = model.toLowerCase();

            //Pour la page de liste:
            var absoluteDirname = "app/components/" + url;
            var dirname = "./" + absoluteDirname;
            var filename = url.replace(/\//g, '-');
            var className = helpers.camelize(filename);
            var modelName = helpers.camelize(model);

            var conf = {
                'url': url,
                'api_endpoint': api_endpoint,
                'absoluteDirname': absoluteDirname,
                'dirname': dirname,
                'filename': filename,
                'className': className,
                'model': model,
                'modelName': modelName
            }

            // Pour le composant
            // var componentListContent = ;

            const readline = require('readline');
            const fs = require('fs');
            const options = {
                flags: 'r',
                encoding: null,
                fd: null,
                mode: 0o666,
                autoClose: true
            };

            const rl = readline.createInterface({
                input: fs.createReadStream('bin/generator/templates/ngCrud/component.ts.base', options)
            });

            var read = true;
            var componentListContent = "tmp1";
            var componentEditContent = "tmp2";
            var serviceContent = "tmp3";

            rl.on('line', function(line) {
                if (line == "~~STOP~~")
                    read = false;
                if (read) {
                    var value = line;
                    if (value.indexOf("~~") > -1)
                        for (var key in conf)
                            value = replaceAll(value, key, conf[key]);

                    componentListContent = componentListContent + value + '\n';
                }
            }).on('close', () => {
                console.log("result: ", componentListContent);
                process.exit(0);
            });

            var componentListContent = "tmp1";
            var componentEditContent = "tmp2";
            var serviceContent = "tmp3";

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
                    //console.log("N'oubliez pas de rajouter la route dans votre fichier app.ts");
                    //console.log("{path: '"+url+"', name: '"+className+"', component: "+className+"Component }");
                    helpers.askData('Voulez vous regénérer automatiquement les routes? ( y / n) ', (reponse) => {
                        if (reponse == 'y') {
                            var route = require("./route");
                            route.generate();
                            helpers.printSeparator();
                            var filename = url.replace(/\//g, '-');
                            console.log(`N'oubliez pas de rajouter dans app.ts, la route de modification suivante:

                  {
                    path: '` + url + `/edit/:id',
                    name: '` + className + `EditId',
                    component: ComponentProxyFactory({
                      path: './dist/components/` + url + `/edit/` + filename + `-edit',
                      provide: m => m.` + className + `Component
                    })
                  },

                   `);
                        } else {
                            console.log('Ok, Pas de modification de route...')
                        }
                    });
                });

            return true;
        }

        // var url = helpers.askDataSync('Quelle url voulez vous pour votre page de CRUD? (exemple: crud/users ) ');
        // var model = helpers.askDataSync('Sur quel modele se base cette page? (exemple: user) ');
        // var api = helpers.askDataSync('A quelle API voulez vous connecter ( exemple: "http://jsonplaceholder.typicode.com/users" ou GLOBAL_CONFIG.api_url+"/user" )? ');

        var url = "gestion-test";
        var model = "model-test";
        var api = 'osseeef';

        createFiles(url, model, api);
    }
}
