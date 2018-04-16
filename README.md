#ng2-generators

Ce package vous permet de créer un CRUD automatiquement

## Installation

`npm install @sdvplurimedia/ngx-generators`
Copier le dossier "_modules.dist" dans une installation valide de @angular/cli en tant que "src/app/_modules"
Ajouter dans votre package.json dans les scripts:
`"gen": "ng2gen",`


## Pré-requis

Avoir un endpoint pour vos API qui respecte certaines normes comme:
- JSON API (par exemple généré avec [laravel-endpoint](https://github.com/SDV-Plurimedia/laravel-endpoint) )
- InfYom API (https://github.com/InfyOmLabs/laravel-generator)

Avoir dans votre page en assets global:
- bootstrap
- datatable.js


## Utilisation

Pour générer un crud complet:
` npm run gen crud `

Pour générer uniquement les routes de vos modules:
`npm run gen route`
