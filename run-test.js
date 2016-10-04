#!/usr/bin/env node
var helpers = require('./helpers');

//script de creation de la page de test
helpers.getListDir("./app/tests",(items)=>{
  var content =
`<html>
  <head>
    <title>1st Jasmine Tests</title>
    <!-- #1. add the system.js and angular libraries -->
    <script src="/node_modules/systemjs/dist/system.src.js"></script>
    <script src="/node_modules/typescript/lib/typescript.js"></script>
    <script src="/node_modules/angular2/bundles/angular2-polyfills.js"></script>
    <script src="/node_modules/rxjs/bundles/Rx.js"></script>
    <script src="/node_modules/angular2/bundles/angular2.dev.js"></script>
    <script src="/node_modules/angular2/bundles/router.dev.js"></script>
    <script src="/node_modules/angular2/bundles/http.js"></script>
    <script src="/node_modules/angular2/bundles/testing.dev.js"></script>

    <link rel="stylesheet" href="./node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
    <script src="./node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
    <script src="./node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
    <script src="./node_modules/jasmine-core/lib/jasmine-core/boot.js"></script>

    <script src="/node_modules/jquery/dist/jquery.min.js"></script>
    <script src="/node_modules/tether/dist/js/tether.min.js"></script>
    <link href="/node_modules/tether/dist/css/tether.min.css" rel="stylesheet">
    <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
    <link href="/node_modules/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <script src="/node_modules/bootstrap-notify/bootstrap-notify.min.js"></script>

    <script>
      System.config({
        //use typescript for compilation
        transpiler: 'typescript',
        //typescript compiler options
        typescriptOptions: {
          emitDecoratorMetadata: true
        },
        //map tells the System loader where to look for things
        map: {
          app: "./app"
        },
        packages: {
          app: {defaultExtension: 'ts'}
        }
      });
      // #3. Import the spec files explicitly
      Promise.all([`;
        for (var i=0; i<items.length; i++) {
            //if(items[i].indexOf('.js.map') === -1){
              content += "System.import('app/tests/"+items[i]+"'),\n";
            //}

        }
        content += `
      ]).then(window.onload)
      .catch(console.error.bind(console));

      `;
      content += `

      </script>
  </head>
  <body>
  </body>
</html>`;
  helpers.createFile(".", "tests.html", content, ()=>{
    console.log('Fichier Jasmine, crée dans tests.html');
    //var open = require("open");
    //open("tests.html");
    const exec = require('child_process').exec;
    const child = exec('lite-server --indexFile "tests.html" ',
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
    });
  });
})
