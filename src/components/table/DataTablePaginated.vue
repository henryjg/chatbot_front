<template>
  <div>
    <!-- Buscador y selector de elementos por página -->
    <div class="px-3">
      <div class="d-flex my-1">
        <div class="wid-100">
          <select :value="perPage" @change="handlePerPageChange" class="form-control">
            <option v-for="option in perPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="w-25 px-1">
          <input 
            :value="searchTerm" 
            @input="handleSearchInput"
            class="form-control" 
            :placeholder="searchPlaceholder" 
          />
        </div>
        <div class="w-75">
          
          <!-- Información de paginación -->
          <div class="d-flex justify-content-end align-items-center h-100">
            <small class="text-muted" v-if="paginationInfo">
              Mostrando {{ paginationInfo.desde }} - {{ paginationInfo.hasta }} 
              de <span class="f-w-700">{{ paginationInfo.total_registros }} registros</span>
            </small>
            <!-- Paginación del servidor -->
            <nav class="px-2" v-show="(!loading || hideLoading) && paginationInfo && paginationInfo.total_paginas > 1" aria-label="Page navigation">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: !paginationInfo?.pagina_anterior }">
                  <a class="page-link" href="#" @click.prevent="goToPage(paginationInfo?.pagina_anterior)">
                    <i class="fa fa-chevron-left"></i> {{ prevLabel }}
                  </a>
                </li>
                <li class="page-item" v-for="page in paginasVisibles" :key="page" 
                    :class="{ 
                      active: page === paginationInfo?.pagina_actual,
                      disabled: page === '...'
                    }">
                  <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                  <span v-else class="page-link disabled">...</span>
                </li>
                <li class="page-item" :class="{ disabled: !paginationInfo?.pagina_siguiente }">
                  <a class="page-link" href="#" @click.prevent="goToPage(paginationInfo?.pagina_siguiente)">
                    {{ nextLabel }} <i class="fa fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading && !hideLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ loadingLabel }}...</span>
      </div>
      <p class="mt-2">{{ loadingLabel }}...</p>
    </div>

    <!-- Tabla -->
    <div 
      v-show="!loading || hideLoading"
      ref="tableContainerRef"
      class="table-responsive table-container" 
      tabindex="0"
      @focus="onTableFocus"
      @click="onTableClick"
      :style="{ 
        height: autoHeight && (!loading || hideLoading) ? calculatedHeight : 'auto'
      }">
      <table class="table table-xs">
        <thead class="table_head_bg sticky-md-top border-1">
          <!-- Primera fila: Solo texto -->
          <tr class="b-gray header-text-row">
            <!-- Checkbox para selección múltiple -->
            <th v-if="selectable" class="text-center mx-2 px-2" style="width: 1%;" rowspan="2">
              <div class="form-check">
                <input 
                  type="checkbox"
                  class="form-check-input input-primary"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                  id="selectAll"
                />
              </div>
            </th>
            
            <th v-for="(header, index) in headers" :key="'text-' + index" :style="{ width: header.width }"
              :class="['text-sm text-white pb-1']">
              <div class="d-flex align-items-center justify-content-start">
                <span class="header-text">
                  {{ header.text }}
                </span>
              </div>
            </th>
          </tr>
          
          <!-- Segunda fila: Ordenamiento y filtros -->
          <tr class="b-gray header-filter-row">
            <th v-for="(header, index) in headers" :key="'controls-' + index" 
              :class="['text-sm text-white pt-1 pb-2']">
              <div class="d-flex align-items-center justify-content-between">
                <!-- Indicador de ordenamiento a la izquierda -->
                <span v-if="header.sortable !== false" 
                      @click="sortBy(header.key)" 
                      class="sort-control cursor-pointer">
                  <span v-if="sortKey === header.key">
                    <i v-if="sortOrder === 'asc'" class="fa fa-arrow-up"></i>
                    <i v-else class="fa fa-arrow-down"></i>
                  </span>
                  <span v-else class="sort-indicator">⇅</span>
                </span>
                <span v-else class="sort-placeholder"></span>

                <!-- Botón de filtro a la derecha -->
                <span v-if="header.filterable !== false" 
                      @click="toggleFilterDropdown(header.key, $event)"
                      class="filter-button"
                      :class="{ 'filter-active': isFilterActive(header.key) }">
                  <i class="fas fa-filter"></i>
                </span>
                <span v-else class="filter-placeholder"></span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
            <slot v-for="(item, index) in items"
                :item="item"
                :index="index"
                :key="item[itemIdKey] || index"
                :currentPage="currentPage"
                :itemsPerPage="perPage"
                :selectable="selectable"
                :isItemSelected="isItemSelected"
                :toggleSelectItem="toggleSelectItem"
                :itemIdKey="itemIdKey"
                :selectedItems="selectedItemsArray"
                :clearSelection="clearSelection"
                :handleMouseDown="handleMouseDown"
                :isDragging="isDragging"
                :focusedRowIndex="focusedRowIndex"
                :isKeyboardNavigation="isKeyboardNavigation"
                :globalIndex="((currentPage - 1) * perPage) + index + 1">
            </slot>
        </tbody>
      </table>
    </div>

    <!-- Dropdown de filtros tipo Excel mejorado -->
    <div v-if="activeFilterDropdown" 
         class="filter-dropdown"
         :style="{ 
           top: filterDropdownPosition.top + 'px', 
           left: filterDropdownPosition.left + 'px' 
         }"
         @click.stop
         @keydown.esc="closeFilterDropdown"
         tabindex="-1"
         ref="filterDropdownRef">
      <div class="filter-dropdown-header">
        <h6 class="mb-2">Filtrar {{ getHeaderText(activeFilterDropdown) }}</h6>
        <button @click="closeFilterDropdown" class="btn-close-filter">×</button>
      </div>
      
      <!-- Pestañas para alternar entre métodos de filtrado -->
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { 'active': filterMode[activeFilterDropdown] === 'advanced' }]"
          @click="setFilterMode(activeFilterDropdown, 'advanced')">
          {{ getHeaderType(activeFilterDropdown) === 'number' ? 'Operaciones' : 'Búsqueda' }}
        </button>
        <button 
          :class="['filter-tab', { 'active': filterMode[activeFilterDropdown] === 'checkbox' }]"
          @click="setFilterMode(activeFilterDropdown, 'checkbox')">
          Lista valores
        </button>
      </div>

      <!-- Modo avanzado: Filtros numéricos o de texto -->
      <div v-if="filterMode[activeFilterDropdown] === 'advanced'">
        <!-- Filtros para números -->
        <div v-if="getHeaderType(activeFilterDropdown) === 'number'" class="number-filter-container">
          <div class="mb-3">
            <label class="form-label small">Operación:</label>
            <select v-model="numberFilterOperation[activeFilterDropdown]" 
                    class="form-select form-select-sm"
                    @change="applyNumberFilter">
              <option value="">Seleccionar operación</option>
              <option value="equals">Igual a</option>
              <option value="notEquals">Diferente de</option>
              <option value="greater">Mayor que</option>
              <option value="greaterEqual">Mayor o igual</option>
              <option value="less">Menor que</option>
              <option value="lessEqual">Menor o igual</option>
              <option value="between">Entre</option>
              <option value="empty">Está vacío</option>
              <option value="notEmpty">No está vacío</option>
            </select>
          </div>
          
          <div v-if="needsValue(numberFilterOperation[activeFilterDropdown])" class="mb-3">
            <label class="form-label small">Valor:</label>
            <input v-model.number="numberFilterValue[activeFilterDropdown]" 
                   type="number" 
                   class="form-control form-control-sm"
                   placeholder="Ingrese valor"
                   @input="applyNumberFilter">
          </div>
          
          <div v-if="numberFilterOperation[activeFilterDropdown] === 'between'" class="mb-3">
            <label class="form-label small">Valor hasta:</label>
            <input v-model.number="numberFilterValueTo[activeFilterDropdown]" 
                   type="number" 
                   class="form-control form-control-sm"
                   placeholder="Valor máximo"
                   @input="applyNumberFilter">
          </div>
          
          <div class="filter-actions">
            <button @click="clearNumberFilter(activeFilterDropdown)" 
                    class="btn btn-sm btn-outline-secondary">
              Limpiar filtro
            </button>
          </div>
        </div>
        
        <!-- Filtros para texto -->
        <div v-else class="text-filter-container">
          <div class="mb-3">
            <label class="form-label small">Buscar texto que contenga:</label>
            <input v-model="textFilterValue[activeFilterDropdown]" 
                   type="text" 
                   class="form-control form-control-sm"
                   placeholder="Texto a buscar..."
                   @input="applyTextFilter">
          </div>
          
          <div class="form-check mb-3">
            <input v-model="textFilterCaseSensitive[activeFilterDropdown]" 
                   type="checkbox" 
                   class="form-check-input"
                   id="caseSensitive"
                   @change="applyTextFilter">
            <label class="form-check-label small" for="caseSensitive">
              Distinguir mayúsculas/minúsculas
            </label>
          </div>
          
          <div class="filter-actions mb-3">
            <button @click="clearTextFilter(activeFilterDropdown)" 
                    class="btn btn-sm btn-outline-secondary">
              Limpiar filtro
            </button>
          </div>
        </div>
      </div>

      <!-- Modo checkbox: Lista tradicional de valores -->
      <div v-else class="checkbox-filter-container">
        <!-- Campo de búsqueda dentro del filtro -->
        <div class="filter-search-container">
          <input 
            v-model="filterSearchQuery" 
            type="text" 
            class="form-control form-control-sm" 
            placeholder="Buscar valores..."
            @click.stop>
        </div>
        
        <div class="filter-actions mb-2">
          <button @click="selectAllFilterValues(activeFilterDropdown)" 
                  class="btn btn-sm btn-outline-primary me-1">
            Seleccionar todo
          </button>
          <button @click="clearAllFilterValues(activeFilterDropdown)" 
                  class="btn btn-sm btn-outline-secondary">
            Limpiar
          </button>
        </div>
        
        <div class="filter-values">
          <div v-if="getUniqueValues(activeFilterDropdown).length === 0 && filterSearchQuery" 
               class="filter-no-results">
            <span class="text-muted">No se encontraron valores que coincidan con "{{ filterSearchQuery }}"</span>
          </div>
          <div v-for="value in getUniqueValues(activeFilterDropdown)" 
               :key="value" 
               class="filter-value-item">
            <label class="d-flex align-items-center">
              <input type="checkbox" 
                     :checked="columnFilters[activeFilterDropdown]?.includes(value)"
                     @change="toggleFilterValue(activeFilterDropdown, value)"
                     class="me-2">
              <span>{{ value || '(Vacío)' }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div v-if="activeFilterDropdown" 
         class="filter-overlay"
         @click="closeFilterDropdown">
    </div>

    <!-- Selector visual para drag selection -->
    <div v-if="selectorVisible" 
         class="drag-selector"
         :class="{ 'deselecting': isDeselecting }"
         :style="{
           position: 'fixed',
           top: selectorPosition.top + 'px',
           left: selectorPosition.left + 'px',
           width: selectorPosition.width + 'px',
           height: selectorPosition.height + 'px',
           zIndex: 1000
         }">
    </div>

    <!-- Paginación del servidor -->
    <nav class="pb-3 pt-1" v-show="(!loading || hideLoading) && paginationInfo && paginationInfo.total_paginas > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: !paginationInfo?.pagina_anterior }">
          <a class="page-link" href="#" @click.prevent="goToPage(paginationInfo?.pagina_anterior)">
            <i class="fa fa-chevron-left"></i> {{ prevLabel }}
          </a>
        </li>
        <li class="page-item" v-for="page in paginasVisibles" :key="page" 
            :class="{ 
              active: page === paginationInfo?.pagina_actual,
              disabled: page === '...'
            }">
          <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          <span v-else class="page-link disabled">...</span>
        </li>
        <li class="page-item" :class="{ disabled: !paginationInfo?.pagina_siguiente }">
          <a class="page-link" href="#" @click.prevent="goToPage(paginationInfo?.pagina_siguiente)">
            {{ nextLabel }} <i class="fa fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, PropType, onMounted, onUnmounted, nextTick, watch } from 'vue';

export interface Header {
  text: string;
  width: string;
  key: string; // Clave que se usará para ordenar y filtrar los datos
  type?: 'string' | 'number' | 'date'; // Tipo de dato para ordenamiento inteligente
  sortable?: boolean; // Si la columna es ordenable
  filterable?: boolean; // Si la columna permite filtrado tipo Excel
}

export interface PaginationInfo {
  pagina_actual: number;
  registros_por_pagina: number;
  total_registros: number;
  total_paginas: number;
  pagina_anterior: number | null;
  pagina_siguiente: number | null;
  desde: number;
  hasta: number;
}

export default defineComponent({
  name: 'DataTablePaginated',
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    paginationInfo: {
      type: Object as PropType<PaginationInfo | null>,
      default: null,
    },
    searchTerm: {
      type: String,
      default: '',
    },
    perPage: {
      type: Number,
      default: 25,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    clasehead: {
      type: String,
      default: 'bg-info-100',
    },
    perPageOptions: {
      type: Array as PropType<number[]>,
      default: () => [25, 50, 100, 250],
    },
    searchPlaceholder: {
      type: String,
      default: 'Buscar...',
    },
    loadingLabel: {
      type: String,
      default: 'Cargando',
    },
    prevLabel: {
      type: String,
      default: 'Anterior',
    },
    nextLabel: {
      type: String,
      default: 'Siguiente',
    },
    hideLoading: {
      type: Boolean,
      default: false,
    },
    // Nuevas props para selección múltiple
    selectable: {
      type: Boolean,
      default: false,
    },
    itemIdKey: {
      type: String,
      default: 'id',
    },
    // Prop para ajuste automático de altura
    autoHeight: {
      type: Boolean,
      default: false,
    },
    heightOffset: {
      type: Number,
      default: 100,
    },
    // Prop para valores únicos del servidor (opcional)
    uniqueValues: {
      type: Object as PropType<Record<string, string[]>>,
      default: () => ({}),
    },
  },
  emits: [
    'search',
    'page-change', 
    'per-page-change',
    'sort',
    'filter-change',
    'selection-change',
  ],
  setup(props, { emit }) {
    // Variables para manejo de la ordenación (del servidor)
    const sortKey = ref<string>('');
    const sortOrder = ref<'asc' | 'desc'>('asc');

    // Variables para manejo de filtros tipo Excel
    const columnFilters = ref<Record<string, string[]>>({});
    const activeFilterDropdown = ref<string | null>(null);
    const filterDropdownPosition = ref({ top: 0, left: 0 });
    const filterSearchQuery = ref<string>('');

    // Variables para filtros numéricos mejorados
    const numberFilterOperation = ref<Record<string, string>>({});
    const numberFilterValue = ref<Record<string, number>>({});
    const numberFilterValueTo = ref<Record<string, number>>({});
    
    // Variables para filtros de texto mejorados
    const textFilterValue = ref<Record<string, string>>({});
    const textFilterCaseSensitive = ref<Record<string, boolean>>({});
    
    // Variable para el modo de filtrado (avanzado o checkbox)
    const filterMode = ref<Record<string, 'advanced' | 'checkbox'>>({});

    // Variables para selección múltiple
    const selectedItems = ref<Set<any>>(new Set());
    const isAllSelected = ref<boolean>(false);
    const isIndeterminate = ref<boolean>(false);

    // Variables para selección por rango con Ctrl
    const isDragging = ref<boolean>(false);
    const dragStartIndex = ref<number | null>(null);
    const dragEndIndex = ref<number | null>(null);
    const isCtrlPressed = ref<boolean>(false);
    
    // Variables para el selector visual
    const selectorVisible = ref<boolean>(false);
    const selectorPosition = ref({
      top: 0,
      left: 0,
      width: 0,
      height: 0
    });
    const dragStartPosition = ref({ x: 0, y: 0 });
    const isDeselecting = ref<boolean>(false);

    // Variables para altura automática
    const tableContainerRef = ref<HTMLElement>();
    const calculatedHeight = ref<string>('auto');
    const filterDropdownRef = ref<HTMLElement>();

    // Variables para navegación con teclado
    const focusedRowIndex = ref<number>(-1);
    const isKeyboardNavigation = ref<boolean>(false);

    // Variables para debounce de búsqueda
    const searchDebounceTime = 500;
    let searchTimeout: NodeJS.Timeout | null = null;

    // Computed para páginas visibles en paginación del servidor
    const paginasVisibles = computed(() => {
      if (!props.paginationInfo) return [];
      
      const { pagina_actual, total_paginas } = props.paginationInfo;
      const paginas: (number | string)[] = [];
      
      if (total_paginas <= 7) {
        // Si hay 7 páginas o menos, mostrar todas
        for (let i = 1; i <= total_paginas; i++) {
          paginas.push(i);
        }
      } else {
        // Lógica para paginación inteligente
        paginas.push(1);
        
        if (pagina_actual <= 4) {
          // Inicio: 1, 2, 3, 4, ..., último
          for (let i = 2; i <= 4; i++) {
            paginas.push(i);
          }
          paginas.push('...');
          paginas.push(total_paginas);
        } else if (pagina_actual >= total_paginas - 3) {
          // Final: 1, ..., antepenúltimo, penúltimo, último
          paginas.push('...');
          for (let i = total_paginas - 3; i <= total_paginas; i++) {
            paginas.push(i);
          }
        } else {
          // Medio: 1, ..., actual-1, actual, actual+1, ..., último
          paginas.push('...');
          for (let i = pagina_actual - 1; i <= pagina_actual + 1; i++) {
            paginas.push(i);
          }
          paginas.push('...');
          paginas.push(total_paginas);
        }
      }
      
      return paginas;
    });

    // Funciones para manejo de búsqueda con debounce
    const handleSearchInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const term = target.value;
      
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      searchTimeout = setTimeout(() => {
        emit('search', { term, field: '' });
      }, searchDebounceTime);
    };

    const handlePerPageChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      const perPage = parseInt(target.value);
      emit('per-page-change', perPage);
    };

    const goToPage = (page: number | string | null | undefined) => {
      if (page && typeof page === 'number' && page !== props.currentPage) {
        emit('page-change', page);
      }
    };

    // Funciones para ordenar las columnas (del servidor)
    const sortBy = (key: string) => {
      // Verificar si la columna es ordenable
      const header = props.headers.find(h => h.key === key);
      if (header?.sortable === false) return;
      
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }

      // Emitir evento de ordenamiento al servidor
      emit('sort', { 
        key: sortKey.value, 
        order: sortOrder.value,
        type: header?.type || 'string'
      });
    };

    // Funciones para filtros tipo Excel (adaptado para servidor)
    const getUniqueValues = (columnKey: string) => {
      // Priorizar valores únicos del servidor si están disponibles
      if (props.uniqueValues && props.uniqueValues[columnKey]) {
        let uniqueValues = [...props.uniqueValues[columnKey]];
        
        // Aplicar filtro de búsqueda si existe
        if (filterSearchQuery.value) {
          const searchTerm = filterSearchQuery.value.toLowerCase();
          uniqueValues = uniqueValues.filter(value => 
            value.toLowerCase().includes(searchTerm)
          );
        }
        
        return uniqueValues;
      }
      
      // Fallback: usar valores de la página actual (limitado)
      if (!props.items || !Array.isArray(props.items)) return [];
      
      const values = props.items.map(item => String(item[columnKey] || ''));
      let uniqueValues = [...new Set(values)].sort();
      
      // Aplicar filtro de búsqueda si existe
      if (filterSearchQuery.value) {
        const searchTerm = filterSearchQuery.value.toLowerCase();
        uniqueValues = uniqueValues.filter(value => 
          value.toLowerCase().includes(searchTerm)
        );
      }
      
      return uniqueValues;
    };

    const toggleFilterDropdown = (columnKey: string, event: Event) => {
      if (activeFilterDropdown.value === columnKey) {
        activeFilterDropdown.value = null;
        filterSearchQuery.value = '';
        return;
      }
      
      // Inicializar modo de filtrado
      initializeFilterMode(columnKey);
      
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Dimensiones estimadas del dropdown
      const dropdownWidth = 300;
      const dropdownHeight = 400;
      
      // Dimensiones de la ventana
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calcular posición inicial
      let top = rect.bottom + window.scrollY + 2;
      let left = rect.left + window.scrollX;
      
      // Verificar si se sale por la derecha
      if (left + dropdownWidth > windowWidth) {
        left = rect.right + window.scrollX - dropdownWidth;
        if (left < 0) {
          left = (windowWidth - dropdownWidth) / 2;
        }
      }
      
      // Verificar si se sale por abajo
      if (top + dropdownHeight > window.scrollY + windowHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 2;
        if (top < window.scrollY) {
          top = window.scrollY + 10;
        }
      }
      
      if (left < 0) {
        left = 10;
      }
      
      if (left + dropdownWidth > windowWidth) {
        left = windowWidth - dropdownWidth - 10;
      }
      
      filterDropdownPosition.value = {
        top: top,
        left: left
      };
      
      activeFilterDropdown.value = columnKey;
      filterSearchQuery.value = '';
      
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = [];
      }

      nextTick(() => {
        if (filterDropdownRef.value) {
          setTimeout(() => {
            filterDropdownRef.value?.focus();
          }, 10);
        }
      });
    };

    const toggleFilterValue = (columnKey: string, value: string) => {
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = [];
      }
      
      const index = columnFilters.value[columnKey].indexOf(value);
      if (index > -1) {
        columnFilters.value[columnKey].splice(index, 1);
      } else {
        columnFilters.value[columnKey].push(value);
      }
      
      // Emitir cambio de filtro al servidor
      emitFilterChange();
    };

    const selectAllFilterValues = (columnKey: string) => {
      const uniqueValues = getUniqueValues(columnKey);
      columnFilters.value[columnKey] = [...uniqueValues];
      emitFilterChange();
    };

    const clearAllFilterValues = (columnKey: string) => {
      columnFilters.value[columnKey] = [];
      emitFilterChange();
    };

    const closeFilterDropdown = () => {
      activeFilterDropdown.value = null;
      filterSearchQuery.value = '';
    };

    const isFilterActive = (columnKey: string) => {
      return (columnFilters.value[columnKey] && columnFilters.value[columnKey].length > 0) ||
             numberFilterOperation.value[columnKey] ||
             textFilterValue.value[columnKey];
    };

    // Funciones auxiliares para filtros
    const getHeaderText = (columnKey: string) => {
      const header = props.headers.find(h => h.key === columnKey);
      return header?.text || columnKey;
    };

    const getHeaderType = (columnKey: string) => {
      const header = props.headers.find(h => h.key === columnKey);
      return header?.type || 'string';
    };

    const needsValue = (operation: string) => {
      return !['empty', 'notEmpty'].includes(operation);
    };

    // Funciones para filtros numéricos
    const applyNumberFilter = () => {
      if (!activeFilterDropdown.value) return;
      emitFilterChange();
    };

    const clearNumberFilter = (columnKey: string) => {
      delete numberFilterOperation.value[columnKey];
      delete numberFilterValue.value[columnKey];
      delete numberFilterValueTo.value[columnKey];
      emitFilterChange();
    };

    // Funciones para filtros de texto
    const applyTextFilter = () => {
      if (!activeFilterDropdown.value) return;
      emitFilterChange();
    };

    const clearTextFilter = (columnKey: string) => {
      delete textFilterValue.value[columnKey];
      delete textFilterCaseSensitive.value[columnKey];
      emitFilterChange();
    };

    // Función para cambiar el modo de filtrado
    const setFilterMode = (columnKey: string, mode: 'advanced' | 'checkbox') => {
      filterMode.value[columnKey] = mode;
      
      if (mode === 'advanced') {
        columnFilters.value[columnKey] = [];
      } else {
        clearNumberFilter(columnKey);
        clearTextFilter(columnKey);
      }
    };

    const initializeFilterMode = (columnKey: string) => {
      if (!filterMode.value[columnKey]) {
        filterMode.value[columnKey] = 'checkbox';
      }
    };

    // Función para emitir cambios de filtros al servidor
    const emitFilterChange = () => {
      const filters = {
        columnFilters: columnFilters.value,
        numberFilters: {
          operations: numberFilterOperation.value,
          values: numberFilterValue.value,
          valuesTo: numberFilterValueTo.value
        },
        textFilters: {
          values: textFilterValue.value,
          caseSensitive: textFilterCaseSensitive.value
        }
      };
      
      emit('filter-change', filters);
    };

    // Funciones para selección múltiple
    const selectedItemsArray = computed(() => {
      return Array.from(selectedItems.value);
    });

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedItems.value.clear();
      } else {
        props.items.forEach(item => {
          selectedItems.value.add(item[props.itemIdKey]);
        });
      }
      updateSelectionState();
      emitSelectionChange();
    };

    const toggleSelectItem = (itemId: any) => {
      if (selectedItems.value.has(itemId)) {
        selectedItems.value.delete(itemId);
      } else {
        selectedItems.value.add(itemId);
      }
      updateSelectionState();
      emitSelectionChange();
    };

    const isItemSelected = (itemId: any) => {
      return selectedItems.value.has(itemId);
    };

    const updateSelectionState = () => {
      const currentPageItemIds = props.items.map(item => item[props.itemIdKey]);
      const selectedCurrentPageItems = currentPageItemIds.filter(id => selectedItems.value.has(id));
      
      isAllSelected.value = currentPageItemIds.length > 0 && selectedCurrentPageItems.length === currentPageItemIds.length;
      isIndeterminate.value = selectedCurrentPageItems.length > 0 && selectedCurrentPageItems.length < currentPageItemIds.length;
    };

    const clearSelection = () => {
      selectedItems.value.clear();
      updateSelectionState();
      emitSelectionChange();
    };

    const emitSelectionChange = () => {
      const selectedItemsData = props.items.filter(item => 
        selectedItems.value.has(item[props.itemIdKey])
      );
      emit('selection-change', {
        selectedIds: Array.from(selectedItems.value),
        selectedItems: selectedItemsData,
        count: selectedItems.value.size
      });
    };

    // Funciones para selección por rango con Ctrl + drag
    const handleMouseDown = (index: number, event: MouseEvent) => {
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
      
      if (event.ctrlKey) {
        isDragging.value = true;
        dragStartIndex.value = index;
        dragEndIndex.value = index;
        isCtrlPressed.value = true;
        
        dragStartPosition.value = {
          x: event.pageX,
          y: event.pageY
        };
        
        selectorPosition.value = {
          top: event.pageY,
          left: event.pageX,
          width: 0,
          height: 0
        };
        selectorVisible.value = true;
        
        event.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.value || !isCtrlPressed.value) return;
      
      if (selectorVisible.value) {
        const currentX = event.pageX;
        const currentY = event.pageY;
        
        const left = Math.min(dragStartPosition.value.x, currentX);
        const top = Math.min(dragStartPosition.value.y, currentY);
        const width = Math.abs(currentX - dragStartPosition.value.x);
        const height = Math.abs(currentY - dragStartPosition.value.y);
        
        selectorPosition.value = { left, top, width, height };
      }
      
      const target = event.target as HTMLElement;
      const row = target.closest('tr');
      if (row && row.parentNode) {
        const tbody = row.parentNode as HTMLElement;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentIndex = rows.indexOf(row);
        
        if (currentIndex >= 0) {
          dragEndIndex.value = currentIndex;
          highlightRange();
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging.value && dragStartIndex.value !== null && dragEndIndex.value !== null) {
        selectRange(dragStartIndex.value, dragEndIndex.value);
      }
      
      isDragging.value = false;
      dragStartIndex.value = null;
      dragEndIndex.value = null;
      isCtrlPressed.value = false;
      selectorVisible.value = false;
      isDeselecting.value = false;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      clearRangeHighlight();
    };

    const selectRange = (startIndex: number, endIndex: number) => {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      let allSelected = true;
      const rangeItems = [];
      
      for (let i = start; i <= end; i++) {
        if (i < props.items.length) {
          const item = props.items[i];
          rangeItems.push(item);
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
          }
        }
      }
      
      if (allSelected && rangeItems.length > 0) {
        rangeItems.forEach(item => {
          selectedItems.value.delete(item[props.itemIdKey]);
        });
      } else {
        rangeItems.forEach(item => {
          selectedItems.value.add(item[props.itemIdKey]);
        });
      }
      
      updateSelectionState();
      emitSelectionChange();
    };

    const highlightRange = () => {
      if (dragStartIndex.value === null || dragEndIndex.value === null) return;
      
      const start = Math.min(dragStartIndex.value, dragEndIndex.value);
      const end = Math.max(dragStartIndex.value, dragEndIndex.value);
      
      clearRangeHighlight();
      
      let allSelected = true;
      for (let i = start; i <= end; i++) {
        if (i < props.items.length) {
          const item = props.items[i];
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
            break;
          }
        }
      }
      
      isDeselecting.value = allSelected;
      
      const tbody = document.querySelector('tbody');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let i = start; i <= end && i < rows.length; i++) {
          rows[i].classList.add('drag-selecting');
          if (allSelected) {
            rows[i].classList.add('drag-deselecting');
          }
        }
      }
    };

    const clearRangeHighlight = () => {
      const rows = document.querySelectorAll('tr.drag-selecting, tr.drag-deselecting');
      rows.forEach(row => {
        row.classList.remove('drag-selecting');
        row.classList.remove('drag-deselecting');
      });
    };

    // Event listeners para detectar Ctrl y navegación con teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        isCtrlPressed.value = true;
      }

      if (props.selectable && props.items.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            moveToNextRow();
            break;
          case 'ArrowUp':
            event.preventDefault();
            moveToPreviousRow();
            break;
          case ' ':
            if (event.ctrlKey) {
              event.preventDefault();
              selectCurrentRow();
            }
            break;
          case 'Escape':
            if (activeFilterDropdown.value) {
              closeFilterDropdown();
              event.preventDefault();
              return;
            }
            focusedRowIndex.value = -1;
            isKeyboardNavigation.value = false;
            break;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        isCtrlPressed.value = false;
      }
    };

    // Funciones para navegación con teclado
    const moveToNextRow = () => {
      if (focusedRowIndex.value < props.items.length - 1) {
        focusedRowIndex.value++;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      } else if (focusedRowIndex.value === -1 && props.items.length > 0) {
        focusedRowIndex.value = 0;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      }
    };

    const moveToPreviousRow = () => {
      if (focusedRowIndex.value > 0) {
        focusedRowIndex.value--;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      } else if (focusedRowIndex.value === -1 && props.items.length > 0) {
        focusedRowIndex.value = props.items.length - 1;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      }
    };

    const selectCurrentRow = () => {
      if (focusedRowIndex.value >= 0 && focusedRowIndex.value < props.items.length) {
        const currentItem = props.items[focusedRowIndex.value];
        const itemId = currentItem[props.itemIdKey];
        toggleSelectItem(itemId);
      }
    };

    const scrollToFocusedRow = () => {
      nextTick(() => {
        const tbody = document.querySelector('.table-container tbody');
        if (tbody && focusedRowIndex.value >= 0) {
          const rows = tbody.querySelectorAll('tr');
          const targetRow = rows[focusedRowIndex.value];
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    };

    // Funciones para manejo de foco en la tabla
    const onTableFocus = () => {
      if (focusedRowIndex.value === -1 && props.items.length > 0) {
        focusedRowIndex.value = 0;
        isKeyboardNavigation.value = true;
      }
    };

    const onTableClick = (event: MouseEvent) => {
      if (tableContainerRef.value) {
        tableContainerRef.value.focus();
      }
    };

    // Funciones para altura automática
    const calculateAutoHeight = () => {
      if (!props.autoHeight) return;
      
      if (props.loading && !props.hideLoading) {
        calculatedHeight.value = 'auto';
        return;
      }
      
      nextTick(() => {
        if (!tableContainerRef.value) return;
        
        const container = tableContainerRef.value;
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const availableHeight = windowHeight - rect.top - props.heightOffset;
        const minHeight = 200;
        const finalHeight = Math.max(availableHeight, minHeight);
        
        calculatedHeight.value = `${finalHeight}px`;
      });
    };

    const handleResize = () => {
      if (props.autoHeight) {
        calculateAutoHeight();
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', handleResize);
      
      if (props.autoHeight) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    });

    // Watchers
    watch(() => props.autoHeight, (newValue) => {
      if (newValue) {
        calculateAutoHeight();
      } else {
        calculatedHeight.value = 'auto';
      }
    });

    watch(() => props.loading, () => {
      if (props.autoHeight) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
    });

    watch(() => props.items, () => {
      if (props.autoHeight && !props.loading) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
      // Actualizar estado de selección cuando cambien los items
      updateSelectionState();
    });

    return {
      // Variables de ordenamiento
      sortKey,
      sortOrder,
      sortBy,
      // Variables de paginación
      paginasVisibles,
      goToPage,
      handleSearchInput,
      handlePerPageChange,
      // Filtros tipo Excel
      columnFilters,
      activeFilterDropdown,
      filterDropdownPosition,
      filterSearchQuery,
      getUniqueValues,
      toggleFilterDropdown,
      toggleFilterValue,
      selectAllFilterValues,
      clearAllFilterValues,
      closeFilterDropdown,
      isFilterActive,
      // Funciones auxiliares para filtros
      getHeaderText,
      getHeaderType,
      needsValue,
      // Filtros numéricos
      numberFilterOperation,
      numberFilterValue,
      numberFilterValueTo,
      applyNumberFilter,
      clearNumberFilter,
      // Filtros de texto
      textFilterValue,
      textFilterCaseSensitive,
      applyTextFilter,
      clearTextFilter,
      // Control de modo de filtrado
      filterMode,
      setFilterMode,
      // Variables para selección múltiple
      selectedItems,
      selectedItemsArray,
      isAllSelected,
      isIndeterminate,
      toggleSelectAll,
      toggleSelectItem,
      isItemSelected,
      clearSelection,
      // Variables para selección por drag
      isDragging,
      selectorVisible,
      selectorPosition,
      isDeselecting,
      handleMouseDown,
      // Variables para navegación con teclado
      focusedRowIndex,
      isKeyboardNavigation,
      onTableFocus,
      onTableClick,
      // Variables para altura automática
      tableContainerRef,
      calculatedHeight,
      filterDropdownRef,
    };
  },
});
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.not-sortable {
  cursor: default;
  user-select: none;
}

.header-text {
  cursor: pointer;
  flex: 1;
}

.sortable i {
  margin-left: 5px;
}

.sort-indicator {
  margin-left: 5px;
  color: #ccc;
  font-size: 0.8em;
}

.fa-arrow-up {
  color: #22ff0096;
}

.fa-arrow-down {
  color: #22ff0096;
}

/* Estilos para el botón de filtro */
.filter-button {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  color: #ffffff;
  font-size: 0.8em;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: #22ff0096;
  color: #ffffff;
}

.filter-button.filter-active {
  background-color: #ff6a00;
  color: white;
}

.table > thead >tr{
      border: 1px solid rgba(0,107, 182,1) !important;
}

/* Eliminar espacios entre celdas de la tabla */
.table {
  border-spacing: 0 !important;
  border-collapse: separate !important;
}

.table thead {
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}

/* Estilos para las filas del encabezado */
.header-text-row {
  border-bottom: 1px solid rgba(0,107, 182,1) !important;
}

.header-filter-row {
  border-top: none;
}

/* Estilos para el sticky header - eliminar espacios y gaps */
.table_head_bg.sticky-md-top {
  background-color: #006bb6 !important; /* Fondo sólido */
  border-collapse: collapse !important;
}

.table_head_bg.sticky-md-top th {
  background-color: #006bb6 !important; /* Asegurar fondo en cada celda */
  border-collapse: collapse !important;
  margin: 0 !important;
  padding-left: 8px !important;
  padding-right: 8px !important;
}

.table_head_bg.sticky-md-top .header-text-row th,
.table_head_bg.sticky-md-top .header-filter-row th {
  background-color: #006bb6 !important;
  border-collapse: collapse !important;
}
.thead{
  border: 1px solid rgb(0, 121, 178) !important;
}

.header-text-row th {
  padding-bottom: 4px !important;
  border-bottom: 1px solid rgba(0,107, 182,1) !important;
  border-right: 1px solid rgb(0, 121, 178) !important;
}

.header-filter-row th {
  padding-top: 0px !important;
  padding-bottom: 1px !important;
  border-top: none;
  border-right: 1px solid rgb(0, 121, 178) !important;
}

.filter-placeholder {
  width: 20px;
  height: 16px;
  display: inline-block;
}

.sort-placeholder {
  width: 20px;
  height: 16px;
  display: inline-block;
}

.sort-control {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  color: #ffffff;
  font-size: 0.9em;
  transition: all 0.2s;
  min-width: 20px;
  text-align: center;
}

.sort-control:hover {
  background-color: rgba(34, 255, 0, 0.15);
}

.cursor-pointer {
  cursor: pointer;
}

/* Estilos para el dropdown de filtros */
.filter-dropdown {
  position: fixed !important;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1050;
  min-width: 250px;
  max-width: 350px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  outline: none;
}

.filter-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.filter-dropdown-header h6 {
  margin: 0;
  color: #495057;
  font-weight: 600;
}

.btn-close-filter {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-filter:hover {
  color: #495057;
}

.filter-search-container {
  padding: 8px 12px;
  border-bottom: 1px solid #dee2e6;
}

.filter-search-container input {
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.filter-actions {
  padding: 8px 12px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  gap: 8px;
}

.filter-values {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
}

.filter-value-item {
  padding: 4px 12px;
}

.filter-value-item:hover {
  background-color: #f8f9fa;
}

.filter-value-item label {
  margin: 0;
  cursor: pointer;
  font-size: 0.9em;
}

.filter-no-results {
  padding: 12px;
  text-align: center;
  font-style: italic;
}

/* Estilos para las pestañas de filtrado */
.filter-tabs {
  display: flex;
  border-bottom: 1px solid #dee2e6;
}

.filter-tab {
  flex: 1;
  padding: 8px 12px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  font-size: 0.85em;
  color: #6c757d;
  transition: all 0.2s;
}

.filter-tab:hover {
  background: #e9ecef;
  color: #495057;
}

.filter-tab.active {
  background: white;
  color: #007bff;
  font-weight: 600;
  border-bottom: 2px solid #007bff;
}

/* Estilos para el contenedor de filtros checkbox */
.checkbox-filter-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Estilos para filtros numéricos mejorados */
.number-filter-container {
  padding: 12px;
}

.number-filter-container .form-label {
  font-size: 0.85em;
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
}

.number-filter-container .form-select,
.number-filter-container .form-control {
  font-size: 0.85em;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.number-filter-container .form-select:focus,
.number-filter-container .form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Estilos para filtros de texto mejorados */
.text-filter-container {
  padding: 12px;
}

.text-filter-container .form-label {
  font-size: 0.85em;
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
}

.text-filter-container .form-control {
  font-size: 0.85em;
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.text-filter-container .form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.text-filter-container .form-check-label {
  font-size: 0.85em;
  color: #6c757d;
}

.filter-result-count {
  font-size: 0.8em;
  color: #6c757d;
}

/* Overlay para cerrar dropdown */
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1049;
  background: transparent;
}

/* Estilos para selección múltiple */
.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.form-check-input:indeterminate {
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Estilos para selección por drag */
.drag-selector {
  background-color: rgba(0, 123, 255, 0.2);
  border: 1px solid #007bff;
  pointer-events: none;
}

.drag-selector.deselecting {
  background-color: rgba(220, 53, 69, 0.2);
  border-color: #dc3545;
}

.drag-selecting {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.drag-deselecting {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

/* Estilos para navegación con teclado */
tbody tr:nth-child(n+1):focus,
tbody tr.keyboard-focused {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

tbody tr.keyboard-focused td {
  background-color: inherit !important;
}

/* Mejorar el contraste del foco */
.table-container {
  transition: outline 0.2s ease;
}

/* Estilos para paginación del servidor */
.pagination {
  margin: 0;
}

.page-link {
  border-color: #dee2e6;
  color: #6c757d;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Indicador visual para columnas ordenables */
.sortable::after {
  content: ' ⇅';
  opacity: 0.3;
  font-size: 0.8em;
}

.sortable:hover::after {
  opacity: 0.6;
}
</style>