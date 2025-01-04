import { Directive, Injectable } from "@angular/core";
 
@Injectable({
    providedIn: 'root' // Esto asegura que esté disponible globalmente
  })
export class Globals{
    sociedad={
        Silvestre:'Silvestre',
        Neoagrum:'Neoagrum',
        Clenvi:'Clenvi',
        Itagro:'Itagro',
    }
    tipoDocumentoRetencion={
        retencionSUNAT:20
    }
}