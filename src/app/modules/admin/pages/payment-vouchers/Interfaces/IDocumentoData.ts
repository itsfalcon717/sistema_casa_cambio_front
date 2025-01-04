export interface IDocumentoData {
    serie: string;
    numero: number;
    empresa: string;
    id_Agenda: string;
    proveedor: string;
    tipoDocumento: string;
    id_Moneda: number;
    importe: number;
    saldo: number;
    fechaVencimiento: string;
    fechaEstimadaPago: string;
    documentoPagado: string;
    fechaPago: string;
    importePago: number;
    detraccion: string;
    detraccionImporte: number;
    retencion: string;
    retencionImporte: number;
    banco: string;
    importeFactoring: number;
  }