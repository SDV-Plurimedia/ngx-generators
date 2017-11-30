var helpers = require('../../helpers');

module.exports = {

  generate: function(argv) {

    var complement_name = helpers.askDataSync('Quelle nom voulez-vous pour votre complement ? (minuscule et tiret -, exemple: complement-test) ');
    var use_meta = helpers.askDataSync('Votre complement utilise il des meta data ? (y / n) ');

    // les champs du formulaire generés automatiquements
    var metaForm = '';

    if ( use_meta.toLowerCase() === 'y' ) {
      var champ = 'y';
      // boucle d'ajout des meta
      while(champ.toLowerCase() == 'y') {
        var nom = helpers.askDataSync('Quel est le nom de votre meta-data ? ');
        metaForm +=  `        <div><label>Meta ${nom}</label><input type="text" [(ngModel)]="meta.${nom}"/></div>\n`
        champ = helpers.askDataSync('Voulez vous ajouter un autre champ (y / n) ? ');
      }
    }

    //Pour la page de liste:
    var absoluteDirname = "src/app/_modules/"+complement_name+"/";
    var dirname = "./" + absoluteDirname;
    var filename = complement_name.replace(/\//g, '-');
    var className = helpers.camelize(filename);
    var routeName = helpers.lcfirst(className);

    var conf = {
        'absoluteDirname': absoluteDirname,
        'dirname': dirname,
        'filename': filename,
        'className': className,
        'metaForm': metaForm,
        'routeName': routeName
    }

    var asq = require("async");
    var generator_templates = __dirname+"/../templates/complement/";
    asq.parallel([
            (cb) => {
                helpers.getFileAndReplaceOccurences(generator_templates + "_widgets/complement/complement.ts.base", conf, cb);
            },
            (cb) => {
                helpers.getFileAndReplaceOccurences(generator_templates + "_widgets/complement-popup/complement-popup.ts.base", conf, cb);
            },
            (cb) => {
                helpers.getFileAndReplaceOccurences(generator_templates + "complement.module.ts.base", conf, cb);
            },
            (cb) => {
                helpers.getFileAndReplaceOccurences(generator_templates + "complement.routing.ts.base", conf, cb);
            },
            (cb) => {
                helpers.getFileAndReplaceOccurences(generator_templates + "complement.displayrules.ts.base", conf, cb);
            }
        ],
        function(err, results) {
            write(results);
        }
    );

    var write = function(results) {
        var complement = results[0];
        var complement_popup = results[1];
        var modulets = results[2];
        var route = results[3];
        var displayrules = results[4];
        var asq = require("async");
        asq.parallel(
            [
                (cb) => {
                    helpers.createFileIfNotExist(dirname + '/_widgets/' + filename, filename + ".ts", complement, cb);
                },
                (cb) => {
                    helpers.createFileIfNotExist(dirname + '/_widgets/' + filename + '-popup', filename + '-popup.ts', complement_popup, cb);
                },
                (cb) => {
                    helpers.createFileIfNotExist(dirname, filename + '.module.ts', modulets, cb);
                },
                (cb) => {
                    helpers.createFileIfNotExist(dirname, filename + '.routing.ts', route, cb);
                },
                (cb) => {
                    helpers.createFileIfNotExist(dirname, filename + '.displayrules.ts', displayrules, cb);
                }
            ],
            function(err, results) {
              console.log('Complement généré');
              helpers.askData('Voulez vous modifier automatiquement le fichier de routes des modules? ( y / n) ', (reponse) => {
                if(reponse.toLowerCase() === 'y') {
                  var route = require("./route");
                  route.generate();
                }
              });

            }
        );
    }
  }
}
