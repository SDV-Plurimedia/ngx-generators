var fs = require('fs');

module.exports = {
    camelize: function(str) {
        return str.replace(/(?:^|[-])(\w)/g, function(a, c) {
            return c ? c.toUpperCase() : '';
        });
    },

    printSeparator: function() {
        console.log("================================================");
    },

    askDataSync: function(quest) {
        var readlineSync = require('readline-sync');

        // Wait for user's response.
        var retour = readlineSync.question(quest);
        return retour;
    },

    askData: function(question, cb) {
        const readline = require('readline');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, function(answer) {
            console.log('   --> ', answer);
            rl.close();
            //process.stdin.destroy();
            return cb(answer);
        });
    },

    getHierarchy(filename) {
        var slashNumber = filename.split(/\//).length - 1;
        var hierarchy = "";
        for (var i = 0; i < slashNumber; i++)
            hierarchy += "../";
        return hierarchy;
    },

    getFile(file, cb) {
        fs.readFile(file, (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    copyFile(source, destination) {
        fs.createReadStream(source).pipe(fs.createWriteStream(destination));
    },

    //remplace debut(.*)fin par donnee dans input
    replacePlaceHolder(input, debut, fin, donnee) {
        var reg_term = debut + "([^]*)" + fin;
        var regex = new RegExp(reg_term, "mgi");
        var retour = (input + "").replace(regex, donnee);
        return retour;
    },

    //remplis debut(.*)fin avec donnee dans input
    placeInPlaceHolder(input, debut, fin, donnee) {
        return this.replacePlaceHolder(input, debut, fin, debut + donnee + fin);
    },

    getFileInDirRecursive: function(folder) {
        var fileContents = fs.readdirSync(folder),
            filesTab = [],
            stats;

        fileContents.forEach((fileName) => {
            stats = fs.lstatSync(folder + '/' + fileName);

            if (stats.isDirectory()) {
                filesTab = filesTab.concat(this.getFileInDirRecursive(folder + '/' + fileName));
            } else {
                filesTab.push(folder + '/' + fileName);
            }
        });

        return filesTab;
    },

    getListDir: function(path, cb) {
        fs.readdir(path, function(err, items) {
            cb(items);
        });
    },

    //cree un fichier meme s'il existe deja
    createFile(dirname, filename, content, cb) {
        var mkdirp = require('mkdirp');
        //var asq = require("async");

        mkdirp(dirname, function(err) {
            if (err) {
                console.error("err: ", err);
                if (typeof cb == 'function') {
                    return cb(err);
                }
            } else {
                fs.writeFile(dirname + '/' + filename, content, function(err) {
                    if (typeof cb == 'function') {
                        return cb(err);
                    }
                });
            }
        });
    },

    replaceAll: function(str, find, replace) {
        // définit comment les balises des templates doivent être récupéré (ex: ~~modelName~~)

    },

    test: function() {
        console.log("test");
    },

    getFileAndReplaceOccurences: function(path, conf, cb) {
        var content = "";

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
            input: fs.createReadStream(path, options)
        });

        rl.on('line', function(line) {
            var value = line;
            if (value.indexOf("~~") > -1)
                for (var key in conf) {
                    var baliseTpl = "~~";
                    var find = baliseTpl + key + baliseTpl;

                    value = value.replace(new RegExp(find, 'g'), conf[key]);
                }
            content = content + value + '\n';
        }).on('close', () => {
            cb(null, content);
            return content;
        });
    },

    createFileIfNotExist: function(dirname, filename, content, cb) {
        fs.stat(dirname + '/' + filename, (err, stat) => {
            if (err !== null) {
                this.createFile(dirname, filename, content, cb);
            } else {
                console.log('Le fichier "' + dirname + '/' + filename + '" existe deja ');
                if (typeof cb == 'function') {
                    return cb(err);
                }
            }
        });
    }

}
