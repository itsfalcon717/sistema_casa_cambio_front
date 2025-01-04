import { IDocumentoData } from "./IDocumentoData";

export interface IResponseFiltro {
  
    statusCode:number;
    code:number;
    data:IDocumentoData[];
    message:string;
  }