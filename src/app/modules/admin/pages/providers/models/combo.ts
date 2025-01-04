export interface ResponseCombo {
  statusCode: number
  code: number
  data:DataCombo[]
  message: string
}
 export interface DataCombo{
      id: number
      nombre: string
}
