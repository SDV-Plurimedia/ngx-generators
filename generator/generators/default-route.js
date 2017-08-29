var helpers = require('../../helpers');

module.exports = {
  generate: function(argv) {
    var redirectTo = helpers.askDataSync(
      'Quelle route par défaut souhaitez-vous utiliser ? (ex: "/dashboard")'
    );

    if (redirectTo === '' || redirectTo === null || redirectTo === undefined) {
      redirectTo = '/dashboard';
    }

    if (redirectTo.substring(0, 1) !== '/') {
      redirectTo = '/' + redirectTo;
    }

    var filePath = __dirname + '/../templates/default-route/default-route.routing.ts';
    helpers.getFileAndReplaceOccurences(
      filePath,
      { redirectToPlaceholder: redirectTo },
      function(err, data) {
        helpers.createFile(
          "src/app/default-route",
          "default-route.routing.ts",
          data,
          function() {
            console.log("Route par défaut en place");
          }
        );
      }
    );
  }
};
