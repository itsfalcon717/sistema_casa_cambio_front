/* eslint-disable */
// import { FuseNavigationItem } from '@fuse/components/navigation'

// export const defaultNavigation: FuseNavigationItem[] = [
//   {
//     id: 'providers',
//     title: 'Proveedores',
//     subtitle: 'Gestión de proveedores',
//     type: 'group',
//     icon: 'heroicons_outline:home',
//     idPerfil: [1, 2],
//     children: [
//       {
//         id: 'dashboards.project',
//         title: 'menu.data_prove',
//         type: 'basic',
//         icon: 'heroicons_outline:clipboard-document-check',
//         link: '/providers/info',
//         idPerfil: [2],
//       },
//       {
//         id: 'dashboards.project',
//         title: 'menu.eva_suplier',
//         type: 'basic',
//         icon: 'heroicons_outline:clipboard-document-list',
//         link: '/providers/evaluate',
//         idPerfil: [1],
//       },
//     ],
//   },
//   {
//     id: 'purchase_orders',
//     title: 'Ordenes de Compra',
//     subtitle: 'Gestión de ordenes de compra',
//     type: 'group',
//     icon: 'heroicons_outline:home',
//     idPerfil: [1, 2],
//     children: [
//       {
//         id: 'dashboards.project',
//         title: 'menu.migohes',
//         type: 'basic',
//         icon: 'heroicons_outline:clipboard',
//         link: '/migohess',
//         idPerfil: [1, 2],
//       },
//       {
//         id: 'dashboards.project',
//         title: 'menu.purchase_orders',
//         type: 'basic',
//         icon: 'heroicons_outline:shopping-cart',
//         link: '/purchase_orders/publication',
//         idPerfil: [1, 2],
//       },
//     ],
//   },
//   {
//     id: 'paymentVouchers',
//     title: 'Consulta de Comprobantes',
//     subtitle: 'Gestión de Comprobantes de Pago',
//     type: 'group',
//     icon: 'heroicons_outline:home',
//     idPerfil: [1, 2],
//     children: [
//       {
//         id: 'dashboards.project',
//         title: 'menu.paymentVouchers',
//         type: 'basic',
//         icon: 'heroicons_outline:clipboard-document-list',
//         link: '/paymentVouchers/publication',
//         idPerfil: [1,2],
//       },
//     ],
//   },
//   {
//     id: 'config',
//     title: 'Configuración',
//     subtitle: '',
//     type: 'group',
//     icon: 'heroicons_outline:home',
//     idPerfil: [1],
//     children: [
//       //   {
//       //     id: 'dashboards.project',
//       //     title: 'Usuarios',
//       //     type: 'basic',
//       //     icon: 'heroicons_outline:user-group',
//       //     link: '/config/users',
//       //     idPerfil: [1],
//       //   },

//       {
//         id: 'dashboards.project',
//         title: 'Roles y Permisos',
//         type: 'basic',
//         icon: 'heroicons_outline:shield-check',
//         link: '/config/roles',
//         idPerfil: [1],
//       },

//       //   {
//       //     id: 'dashboards.project',
//       //     title: 'Cuestionarios de Homologación',
//       //     type: 'basic',
//       //     icon: 'heroicons_outline:clipboard-document-check',
//       //     link: '/config/questionnaires',
//       //     idPerfil: [1],
//       //   },
//     ],
//   },
// ]
// export const compactNavigation: FuseNavigationItem[] = [
//   {
//     id: 'dashboards',
//     title: 'Dashboards',
//     tooltip: 'Dashboards',
//     type: 'aside',
//     icon: 'heroicons_outline:home',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'apps',
//     title: 'Apps',
//     tooltip: 'Apps',
//     type: 'aside',
//     icon: 'heroicons_outline:qrcode',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'pages',
//     title: 'Pages',
//     tooltip: 'Pages',
//     type: 'aside',
//     icon: 'heroicons_outline:document-duplicate',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'user-interface',
//     title: 'UI',
//     tooltip: 'UI',
//     type: 'aside',
//     icon: 'heroicons_outline:rectangle-stack',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'navigation-features',
//     title: 'Navigation',
//     tooltip: 'Navigation',
//     type: 'aside',
//     icon: 'heroicons_outline:bars-3',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
// ]
// export const futuristicNavigation: FuseNavigationItem[] = [
//   {
//     id: 'dashboards',
//     title: 'DASHBOARDS',
//     type: 'group',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'apps',
//     title: 'APPS',
//     type: 'group',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'others',
//     title: 'OTHERS',
//     type: 'group',
//   },
//   {
//     id: 'pages',
//     title: 'Pages',
//     type: 'aside',
//     icon: 'heroicons_outline:document-duplicate',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'user-interface',
//     title: 'User Interface',
//     type: 'aside',
//     icon: 'heroicons_outline:rectangle-stack',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'navigation-features',
//     title: 'Navigation Features',
//     type: 'aside',
//     icon: 'heroicons_outline:bars-3',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
// ]
// export const horizontalNavigation: FuseNavigationItem[] = [
//   {
//     id: 'dashboards',
//     title: 'Dashboards',
//     type: 'group',
//     icon: 'heroicons_outline:home',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'apps',
//     title: 'Apps',
//     type: 'group',
//     icon: 'heroicons_outline:qrcode',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'pages',
//     title: 'Pages',
//     type: 'group',
//     icon: 'heroicons_outline:document-duplicate',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'user-interface',
//     title: 'UI',
//     type: 'group',
//     icon: 'heroicons_outline:rectangle-stack',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
//   {
//     id: 'navigation-features',
//     title: 'Misc',
//     type: 'group',
//     icon: 'heroicons_outline:bars-3',
//     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
//   },
// ]
