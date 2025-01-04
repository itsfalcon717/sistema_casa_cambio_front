import { IOrdenCompra } from "./IOrderCompra";

export interface IPublicationResponse{
    statusCode:number;
    code:number;
    data:IOrdenCompra[];
    message:string;
}