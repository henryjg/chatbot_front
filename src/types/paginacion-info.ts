export interface PaginacionInfo {
  pagina_actual: number;
  registros_por_pagina: number;
  total_registros: number;
  total_paginas: number;
  pagina_anterior: number | null;
  pagina_siguiente: number | null;
  paginas_visibles: (number | string)[];
  desde: number;
  hasta: number;
}
