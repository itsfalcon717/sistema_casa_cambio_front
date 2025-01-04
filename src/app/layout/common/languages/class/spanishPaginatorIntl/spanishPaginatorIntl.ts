import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ChangeDetectorRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpanishPaginatorIntl extends MatPaginatorIntl {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
  ) {
    super();
    const idioma = localStorage.getItem('idioma') || 'es'
    this.setLabels(idioma); // Idioma predeterminado, aquí en español
  }

  setLabels(lang: string) {

    if (lang === 'es') {
      this.itemsPerPageLabel = 'Elementos por página';
      this.nextPageLabel = 'Página siguiente';
      this.previousPageLabel = 'Página anterior';
      this.firstPageLabel = 'Primera página';
      this.lastPageLabel = 'Última página';
    } else {
      // Configuración para otro idioma, como inglés
      this.itemsPerPageLabel = 'Items per page';
      this.nextPageLabel = 'Next page';
      this.previousPageLabel = 'Previous page';
      this.firstPageLabel = 'First page';
      this.lastPageLabel = 'Last page';
    }
    this.changes.next(); // Notifica al paginador del cambio de idioma
  }
}
