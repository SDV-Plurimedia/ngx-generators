var helpers = require('../../helpers');

module.exports = {

    generate: function(argv) {

        //ETAPE 2
        var createFiles = function(module_name) {

            helpers.printSeparator();

            //on mets des valeurs par défaut au besoin
            module_name = (typeof module_name !== 'undefined' && module_name !== "") ? module_name : "example/module-default";

            //on s'assure du format
            module_name = module_name.toLowerCase();


            var hierarchy = helpers.getHierarchy(module_name);
            var absoluteDirname = "src/app/_modules/" + module_name;
            var dirname = "./" + absoluteDirname;
            var filename = module_name.replace(/\//g, '-');
            var className = helpers.camelize(filename);
            var routeName = helpers.lcfirst(className);


            var conf = {
                'absoluteDirname': absoluteDirname,
                'dirname': dirname,
                'filename': filename,
                'className': className,
                'routeName': routeName,
                'hierarchy': hierarchy,
                'moduleName': module_name
            }

            var asq = require("async");
            var generator_templates = __dirname+"/../templates/module/";
            asq.parallel([
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"widgets.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"module.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"component.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"routing.ts.base", conf, cb);
                    },
                    (cb) => {
                        helpers.getFileAndReplaceOccurences(generator_templates+"displayrules.ts.base", conf, cb);
                    }
                ],
                function(err, results) {
                    write(results);
                }
            )

            var write = function(results) {
                var widgetContent = results[0];
                var moduleContent = results[1];
                var componentContent = results[2];
                var routingContent = results[3];
                var displayrulesContent = results[4];

                var asq = require("async");
                asq.parallel(
                    [
                      (cb) => {
                          helpers.createFileIfNotExist(dirname, filename + ".widgets.ts", widgetContent, cb)
                      },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".module.ts", moduleContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".component.ts", componentContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".routing.ts", routingContent, cb)
                        },
                        (cb) => {
                            helpers.createFileIfNotExist(dirname, filename + ".displayrules.ts", displayrulesContent, cb)
                        }
                    ],
                    function() {
                        //aprés avoir tout ecris
                        helpers.askData('Voulez vous modifier automatiquement le fichier d\'import des modules? ( y / n) ', (reponse) => {
                            if (reponse == 'y') {
                                var route = require("./route");
                                route.generate();
                                helpers.printSeparator();
                                var filename = module_name.replace(/\//g, '-');
                                console.log(`Keep on rolling baby!`);
                            } else {
                                console.log('Ok tanpis, On ne fait pas les imports... :(')
                            }
                        });
                    });
            }
            return true;
        }




        var module_name = helpers.askDataSync('Quelle nom voulez-vous pour votre module? (minuscule et tiret -, exemple: annuaire-contact) ');
        createFiles(module_name);

    }
}
