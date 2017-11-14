import {Injectable} from '@angular/core';
// DEBUT IMPORT PLACEHOLDER

// FIN IMPORT PLACEHOLDER

// ce fichier s'occupe de charger les display rules de tous les modules
@Injectable()
export class DisplayRules {

  public rules = [];

  constructor(
    // RULES INCLUES AUTOMATIQUEMENT
    // FIN RULES INCLUES AUTOMATIQUEMENT
  ) {
    // PUSH DES RULES INCLUES AUTOMATIQUEMENT
    // FIN PUSH DES RULES INCLUES AUTOMATIQUEMENT
  }

  addRules(moduleRules) {
    for (var k in moduleRules) {
      if (moduleRules.hasOwnProperty(k)) {
        this.rules[k] = moduleRules[k];
      }
    }
  }
};
