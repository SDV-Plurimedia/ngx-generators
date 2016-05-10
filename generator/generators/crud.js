var helpers = require('../../helpers');

module.exports = {

  generate: function(argv){

  var createFiles = function(url, model,api_endpoint){

    //on mets des valeurs par défaut au besoin
    url = (typeof url !== 'undefined' && url !== "" ) ? url : "crud/users";
    model = (typeof model !== 'undefined' && model !== "" ) ? model : "user";
    api_endpoint = (typeof api_endpoint !== 'undefined' && api_endpoint !== "" ) ? api_endpoint : "GLOBAL_CONFIG.api_url+'/"+model+"'";

    //on s'assure du format
    url = url.toLowerCase();
    model = model.toLowerCase();


    //Pour la page de liste:
    var absoluteDirname = "app/components/"+url;
    var dirname = "./"+absoluteDirname;
    var filename = url.replace(/\//g,'-');
    var className = helpers.camelize(filename);
    var modelName = helpers.camelize(model);


    var componentListContent = `
    import {Component} from '@angular/core';
    import {Router}  from '@angular/router';
    import {`+modelName+`} from '../../../models/`+model+`';
    import {DatatableComponent} from '../../_widgets/datatable/datatable';
    import {`+modelName+`Service} from '../../../services/data/`+model+`';
    import {BootboxService} from '../../../services/bootbox';

    @Component({
      selector: '`+filename+`',
      template: \`
      <h2>Gestion des `+model+`s <button class="pull-right btn btn-info" (click)="add()"><i class="glyphicon glyphicon-plus"></i> Ajouter</button></h2>
      <datatable [data]="`+modelName+`_tab" [structure]="structure" [buttons]="buttons" [parent_scope]="scope"></datatable>\`,
      directives: [DatatableComponent],
      providers: [`+modelName+`Service, BootboxService]
    })

    export class `+className+`Component {
      public `+modelName+`_tab: `+modelName+`[];
      public structure = null;
      /*
      //decommenter ceci pour fixer la structure
      public structure = [
          { id: "id", label: "ID"},
          { id: "name", label: "Nom du `+model+`"}
      ];*/
      public buttons = [
        {
            text: 'Editer',
            action: this.edit,
            class: "btn btn-warning"
        },
        {
            text: 'Supprimer',
            action: this.confirmDelete,
            class: "btn btn-danger"
        }
      ];
      public scope = this;

      constructor(private _`+modelName+`Service: `+modelName+`Service, private _bootbox : BootboxService, private _router: Router){
        _`+modelName+`Service.get().subscribe(response => this.`+modelName+`_tab = response.data);
        _bootbox.setScope(this);

        //si on ne définie pas 'structure' manuellement, on fais ici une structure dynamique
        if(this.structure === null){
          console.log("construction de la structure");
          this.structure = [];
          let inst = new `+modelName+`();
          let proprietes = Object.keys( inst );
          if(proprietes.length == 0){
            console.log("Attention, votre modèle ne contient pas de propriété avec des valeurs par défaut! Donc votre structure de CRUD sera vide...")
          }
          proprietes.forEach((key,index)=>{
            // key: the name of the object key
            // index: the ordinal position of the key within the object
            this.structure.push({
              id: key, label: key.toUpperCase()
            });
          });
        }
      }

      add() {
        this._router.navigate(['`+className+`Edit']);
      }

      edit( data : `+modelName+`) {
        this._router.navigate(['`+className+`EditId', { id: data._id }] );
      }

      confirmDelete(data : `+modelName+`) {
        let id_to_delete = data._id;
        this._bootbox.confirm('Etes-vous sûr de vouloir supprimer le `+model+` '+id_to_delete+' ?', (result: Boolean)=>{
          if(result) {
            this._`+modelName+`Service.deleteById(id_to_delete).subscribe((result) => {
              let index = this.`+modelName+`_tab.indexOf(data);
              this.`+modelName+`_tab.splice(index, 1);
            });
          }
        });
      }

    }
`;

//Pour la page d'edition

var componentEditContent = `
import {Component, Host} from '@angular/core';
import {Router, RouterLink, RouteParams}  from '@angular/router';

import {`+modelName+`}               from '../../../../models/`+model+`';
import {`+modelName+`Service}        from '../../../../services/data/`+model+`';
import {NotificationService}  from '../../../../services/notification';

@Component({
  selector: '`+filename+`-edit',
  template: \`<h2>{{action}} de `+model+`</h2>
  <div class="row" *ngIf="instance_`+modelName+`">

    <div class="col-lg-8" *ngFor="#champ of structure" >
      <div class="form-group">
        <label [attr.for]="champ.id">{{champ.label}}</label>
        <template [ngIf]="champ.type=='string'">
          <input type="text" [(ngModel)]="`+model+`[champ.id]" class="form-control" required name="{{champ.id}}" >
        </template>
        <template [ngIf]="champ.type=='number'">
          <input type="number" [(ngModel)]="`+model+`[champ.id]" class="form-control" required name="{{champ.id}}" >
        </template>
      </div>
    </div>

  </div>
  <div class="row">
    <div class="form-group pull-right">
      <button class="btn btn-success" (click)="save()">Enregistrer</button>
      <button class="btn btn-danger" [routerLink]="['`+className+`']" >Annuler</button>
    </div>
  </div>\`,
  directives: [RouterLink],
  providers: [`+modelName+`Service, NotificationService]
})

export class `+className+`EditComponent {
  public instance_`+modelName+`: `+modelName+`;
  public action : string;
  public structure: any[] = null;
  /*
  //decommenter ceci pour fixer la structure
  public structure = [
      { id: "id", label: "ID"},
      { id: "name", label: "Nom du `+model+`"}
  ];*/

  constructor(private _`+modelName+`Service : `+modelName+`Service,
              private _notifService : NotificationService,
              private _router: Router, private _routeParams: RouteParams){

    let id = this._routeParams.get('id');

    if(id != null) {
      this.action = "Edition";
      this._`+modelName+`Service.getById(id).subscribe( resp => this.instance_`+modelName+` = resp.`+model+` );
    }
    else {
      this.action = "Création";
      this.instance_`+modelName+` = new `+modelName+`();
    }

    //si on ne définie pas 'structure' manuellement, on fais ici une structure dynamique
    if(this.structure === null){
      console.log("construction de la structure");
      this.structure = [];
      let inst = new `+modelName+`();
      let proprietes = Object.keys( inst );
      if(proprietes.length == 0){
        console.log("Attention, votre modèle ne contient pas de propriété avec des valeurs par défaut! Donc votre structure de CRUD sera vide...")
      }
      proprietes.forEach((key,index)=>{
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        console.log(key+" => "+typeof inst[key]);
        this.structure.push({
          id: key, label: key.toUpperCase(), type: (typeof inst[key])
        });
      });
    }

  }
  ngOnInit() {
    // Properties are resolved
  }

  save() {
   this._`+modelName+`Service.post(this.instance_`+modelName+`).subscribe((result) => {
      if(result){
        this._router.navigate(['`+className+`']);
      }
      else {
        this._notifService.error("Une erreur est survenue lors de l'enregistrement.");
      }
    });
  }

}

`;


var serviceContent = `
import {Injectable, Output, EventEmitter} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {Request, Response, Http} from '@angular/http';
import {RESTClient, GET, PUT, POST, DELETE, BaseUrl, Headers, DefaultHeaders, Path, Body, Query, Produces, MediaType} from './angular2-rest';
import {`+modelName+`} from '../../models/`+model+`';
declare var GLOBAL_CONFIG;

@Injectable()
@BaseUrl(`+api_endpoint+`)
@DefaultHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
})
export class `+modelName+`Service extends RESTClient {

    /*protected requestInterceptor(req: Request) {
        //if (SessionFactory.getInstance().isAuthenticated) {
            //req.headers.append('jwt', SessionFactory.getInstance().credentials.jwt);
        //}
    }*/

    /*protected responseInterceptor(resp: Observable<Response>){
        // do sg with responses
        console.log(resp);
        if(resp.indexOf('{') !== "0" && resp.indexOf('[') !== "0"){
          console.log('not a json');
          return null;
        }
        else{
          return resp;
        }
    }*/

    public constructor(protected http: Http) {
      super(http);
    }

    @Produces(MediaType.JSON)
    @GET("")
    public get( @Query("sort") sort?: string): Observable<any> { return null; };

    @Produces(MediaType.JSON)
    @GET("/{id}")
    public getById( @Path("id") id: string): Observable<any> { return null; };

    @Produces(MediaType.JSON)
    @POST("/")
    public post( @Body user: `+modelName+`): Observable<any> { return null; };

    @Produces(MediaType.JSON)
    @PUT("/{id}")
    public putById( @Path("id") id: string, @Body `+model+`: `+modelName+`): Observable<any> { return null; };

    @Produces(MediaType.JSON)
    @DELETE("/{id}")
    public deleteById( @Path("id") id: string): Observable<any> { return null; };

}

`;


  var asq = require("async");
  asq.parallel(
    [
      (cb)=>{helpers.createFileIfNotExist(dirname,filename+".ts", componentListContent,cb)},
      (cb)=>{helpers.createFileIfNotExist(dirname+"/edit",filename+"-edit.ts", componentEditContent,cb)},
      (cb)=>{helpers.createFileIfNotExist("app/services/data",model+".ts", serviceContent,cb)}
    ],function(){
    //aprés avoir tout ecris
    //console.log("N'oubliez pas de rajouter la route dans votre fichier app.ts");
    //console.log("{path: '"+url+"', name: '"+className+"', component: "+className+"Component }");
    helpers.askData('Voulez vous regénérer automatiquement les routes? ( y / n) ',(reponse)=>{
      if(reponse=='y'){
        var route = require("./route");
        route.generate();
        helpers.printSeparator();
        var filename = url.replace(/\//g,'-');
        console.log(`N'oubliez pas de rajouter dans app.ts, la route de modification suivante:

        {
          path: '`+url+`/edit/:id',
          name: '`+className+`EditId',
          component: ComponentProxyFactory({
            path: './dist/components/`+url+`/edit/`+filename+`-edit',
            provide: m => m.`+className+`Component
          })
        },

         `);
      }
      else{
        console.log('Ok, Pas de modification de route...')
      }
    });
  });

    return true;

  };



    //DEBUT DU SCRIPT
    var url =  helpers.askDataSync('Quelle url voulez vous pour votre page de CRUD? (exemple: crud/users ) ');
    var model = helpers.askDataSync('Sur quel modele se base cette page? (exemple: user) ');
    var api = helpers.askDataSync('A quelle API voulez vous connecter ( exemple: "http://jsonplaceholder.typicode.com/users" ou GLOBAL_CONFIG.api_url+"/user" )? ');
    helpers.printSeparator();
    createFiles(url,model,api);

  }

}
