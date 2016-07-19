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
            var absoluteDirname = "app/components/" + url;
            var dirname = "./" + absoluteDirname;
            var filename = url.replace(/\//g, '-');
            var className = helpers.camelize(filename);
            var modelName = helpers.camelize(model);

            // Pour le composant
            // var componentListContent = ;

            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", "../templates/ngCrud/component.ts.base", false);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        var allText = rawFile.responseText;
                    }
                }
            }
            rawFile.send(null);

            console.log(allText);
        };

        var url = helpers.askDataSync('Quelle url voulez vous pour votre page de CRUD? (exemple: crud/users ) ');
        var model = helpers.askDataSync('Sur quel modele se base cette page? (exemple: user) ');
        var api = helpers.askDataSync('A quelle API voulez vous connecter ( exemple: "http://jsonplaceholder.typicode.com/users" ou GLOBAL_CONFIG.api_url+"/user" )? ');
        createFiles(url, model, api);


    }
}
