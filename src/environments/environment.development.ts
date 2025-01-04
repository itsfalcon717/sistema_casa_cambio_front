//const HOST = 'https://as-ge-qas-silver-esupp.azurewebsites.net'
const HOST = 'https://localhost:7013'
const API = '/api'
const API_VERSION = ''

export const environment = {
  url: HOST,

  master: {
    listCountries: `${HOST}${API}${API_VERSION}/master/listarPaises`,
    listRegions: `${HOST}${API}${API_VERSION}/master/listarRegion`,
    listProvinces: `${HOST}${API}${API_VERSION}/master/listarProvincia`,
    listDistricts: `${HOST}${API}${API_VERSION}/master/listarDistrito`,
    listBusinesType: `${HOST}${API}${API_VERSION}/master/listarGiroNegocio`,
    listPersonType: `${HOST}${API}${API_VERSION}/master/listarTipoPersona`,
    listCategoriesProvider: `${HOST}${API}${API_VERSION}/master/listarCategoriaProveedor`,
    listStatusProvider: `${HOST}${API}${API_VERSION}/master/listarEstadoProveedor`,
    listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    listarEmpresa: `${HOST}${API}${API_VERSION}/master/listarEmpresa`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
    // listTypeProvider: `${HOST}${API}${API_VERSION}/master/listarTipoProveedor`,
  },

  auth: {
    login: `${HOST}${API}${API_VERSION}/usuario/login`,
    logout: `${HOST}${API}${API_VERSION}/usuario/logout`,
    forgot: `${HOST}${API}${API_VERSION}/usuario/forgot`,
    reset: `${HOST}${API}${API_VERSION}/usuario/resetearClave`,
    changePass: `${HOST}${API}${API_VERSION}/usuario/cambiarClave`,
  },
  rol: {
    list: `${HOST}${API}${API_VERSION}/perfil/listar`,
    listId: `${HOST}${API}${API_VERSION}/perfil/listarPermiso/`,
    update: `${HOST}${API}${API_VERSION}/perfil/actualizarPermiso/`
  },
  users: {
    list: `${HOST}${API}${API_VERSION}/usuario/listar`,
    create: `${HOST}${API}${API_VERSION}/usuario/crear`,
    update: `${HOST}${API}${API_VERSION}/usuario/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/usuario/eliminar`,
  },
  providers: {
    create: `${HOST}${API}${API_VERSION}/proveedor/crear`,
    update: `${HOST}${API}${API_VERSION}/proveedor/actualizar`,
    erp: `${HOST}${API}${API_VERSION}/proveedor/erp`,
    subsanacion: `${HOST}${API}${API_VERSION}/proveedor/subsanacion`,
    changeState: `${HOST}${API}${API_VERSION}/proveedor/aprobar`,
    list: `${HOST}${API}${API_VERSION}/proveedor/listar`,
    byId: `${HOST}${API}${API_VERSION}/proveedor/buscar`,
    delete: `${HOST}${API}${API_VERSION}/proveedor/listarTipoProveedor`,
    gaf: `${HOST}${API}${API_VERSION}/proveedor/notificarDocumentoContable`,
    listarProveedorEmpresa: `${HOST}${API}${API_VERSION}/proveedor/listarProveedorEmpresa`,
    agregarProveedorEmpresa: `${HOST}${API}${API_VERSION}/proveedor/agregarProveedorEmpresa`,
  },
  contact: {
    create: `${HOST}${API}${API_VERSION}/persona/crear`,
    list: `${HOST}${API}${API_VERSION}/persona/listar`,
    update: `${HOST}${API}${API_VERSION}/persona/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/persona/eliminar`,
  },
  cuenta: {
    create: `${HOST}${API}${API_VERSION}/cuenta/crear`,
    list: `${HOST}${API}${API_VERSION}/cuenta/listar`,
    update: `${HOST}${API}${API_VERSION}/cuenta/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/cuenta/eliminar`,
  },
  catalogo: {
    create: `${HOST}${API}${API_VERSION}/catalogo/crear`,
    list: `${HOST}${API}${API_VERSION}/catalogo/listar`,
    update: `${HOST}${API}${API_VERSION}/catalogo/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/catalogo/eliminar`,
  },
  marca: {
    create: `${HOST}${API}${API_VERSION}/marca/crear`,
    list: `${HOST}${API}${API_VERSION}/marca/listar`,
    update: `${HOST}${API}${API_VERSION}/marca/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/marca/eliminar`,
  },
  ubicacion: {
    create: `${HOST}${API}${API_VERSION}/ubicacion/crear`,
    list: `${HOST}${API}${API_VERSION}/ubicacion/listar`,
    update: `${HOST}${API}${API_VERSION}/ubicacion/actualizar`,
    delete: `${HOST}${API}${API_VERSION}/ubicacion/eliminar`,
  },
  encuesta: {
    finish: `${HOST}${API}${API_VERSION}/encuesta/finalizar`,
    validar: `${HOST}${API}${API_VERSION}/encuesta/validar`,
  },
  descargar: {
    respuesta: `${HOST}${API}${API_VERSION}/descargar/respuesta`,
    catalogo: `${HOST}${API}${API_VERSION}/descargar/catalogo`,
    pregunta: `${HOST}${API}${API_VERSION}/descargar/pregunta`,
    retenciones: `${HOST}${API}${API_VERSION}/consultaComprobante/descargaRet`,
  },
  purchaseOrders: {
    list: `${HOST}${API}${API_VERSION}/consultaOC/filtra`,
  },
  paymentVouchers: {
    list: `${HOST}${API}${API_VERSION}/consultaComprobante/filtra`,
  },
}
