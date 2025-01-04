import { IDetalle } from "./IDetalle";

export interface IOrdenCompra{
    op_OrdenCompra: number;
    id_Agenda: string;
    noregistro: string;
    fechaOrden: string;
    fechaEntrega: string;
    fechaVigencia: string;
    id_Moneda: number;
    neto: number;
    dcto: number;
    subTotal: number;
    impuestos: number;
    total: number;
    observaciones: string;
    id_pago: number;
    id_AgendaDireccion: number;
    modoPago: string;
    notasRecepcion: string;
    estado: string;
    tipoOC: string;
    opSolicitudCompra: number;
    razonSocial: string;
    detalle: IDetalle[];
}