<template>
  <div>
    <!-- Buscador y selector de elementos por página -->
    <div class="px-3">
      <div class="d-flex my-1">
        <div class="wid-100">
          <select v-model="itemsPerPage" class="form-control" @change="resetPage">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="w-50 px-1">
          <input v-model="searchQuery" class="form-control" placeholder="Buscar..." @input="filterData" />
        </div>
        <div class="w-50">
          <!-- Paginación -->
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-end mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">
                  <i class="fas fa-angle-left"></i>
                </a>
              </li>
              <li class="page-item" v-for="page in paginationPages" :key="page" :class="{ active: currentPage === page }">
                <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                <span v-else class="page-link disabled">...</span>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">
                  <i class="fas fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </nav>
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
      <table class="table   table-xs" >
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
            <slot v-for="(item, index) in paginatedAndSortedItems"
                :item="item"
                :index="index"
                :key="item.id"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                :selectable="selectable"
                :isItemSelected="isItemSelected"
                :toggleSelectItem="toggleSelectItem"
                :itemIdKey="itemIdKey"
                :selectedItems="selectedItemsArray"
                :clearSelection="clearSelection"
                :handleMouseDown="handleMouseDown"
                :isDragging="isDragging"
                :focusedRowIndex="focusedRowIndex"
                :isKeyboardNavigation="isKeyboardNavigation">
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
            <!-- Contador de resultados -->
            <div v-if="numberFilterOperation[activeFilterDropdown] && needsValue(numberFilterOperation[activeFilterDropdown]) ? numberFilterValue[activeFilterDropdown] !== undefined : numberFilterOperation[activeFilterDropdown]" 
                 class="filter-result-count mt-2">
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                {{ getFilterResultCount(activeFilterDropdown) }} resultado(s) encontrado(s)
              </small>
            </div>
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
            <!-- Contador de resultados -->
            <div v-if="textFilterValue[activeFilterDropdown]" 
                 class="filter-result-count mt-2">
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                {{ getFilterResultCount(activeFilterDropdown) }} resultado(s) encontrado(s)
              </small>
            </div>
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

      <!-- Lista de valores únicos como referencia - ELIMINADA COMPLETAMENTE -->
      <!-- Esta sección ha sido removida para mejorar la UX en modo búsqueda -->
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

    <!-- Paginación -->
    <nav v-show="!loading || hideLoading" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">Anterior</a>
        </li>
        <li class="page-item" v-for="page in paginationPages" :key="page" :class="{ active: currentPage === page }">
            <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            <span v-else class="page-link disabled">...</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Siguiente</a>
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

export default defineComponent({
  name: 'DataTable',
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    items: {
      type: Array as PropType<any[]>, // Puedes tipar mejor si tienes una interfaz para tus items
      required: true,
    },
    filterKeys: {
      type: Array as PropType<(keyof any)[]>, // Claves que se usarán para filtrar los datos
      required: true,
    },
    // Nuevas props para selección múltiple
    selectable: {
      type: Boolean,
      default: false, // Por defecto deshabilitado para mantener compatibilidad
    },
    itemIdKey: {
      type: String,
      default: 'id', // Clave que identifica únicamente cada item
    },
    // Prop para ajuste automático de altura
    autoHeight: {
      type: Boolean,
      default: false, // Por defecto deshabilitado para mantener compatibilidad
    },
    heightOffset: {
      type: Number,
      default: 100, // Offset en píxeles para dejar espacio al final (paginación, etc.)
    },
    // Props para loading
    loading: {
      type: Boolean,
      default: false, // Por defecto sin loading
    },
    loadingLabel: {
      type: String,
      default: 'Cargando', // Texto que se muestra durante la carga
    },
    hideLoading: {
      type: Boolean,
      default: false, // Permite ocultar completamente el loading
    },
  },
  emits: [
    'selection-change', // Evento que se emite cuando cambia la selección
  ],
  setup(props, { emit }) {
    const searchQuery = ref<string>('');
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(25);
    const itemsPerPageOptions = ref<number[]>([25, 50, 100, 250]);

    // Variables para manejo de la ordenación
    const sortKey = ref<string | null>(null);
    const sortOrder = ref<'asc' | 'desc'>('asc');

    // Variables para manejo de filtros tipo Excel
    const columnFilters = ref<Record<string, string[]>>({});
    const activeFilterDropdown = ref<string | null>(null);
    const filterDropdownPosition = ref({ top: 0, left: 0 });
    const filterSearchQuery = ref<string>(''); // Búsqueda dentro del dropdown de filtros

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

    // Filtrar los elementos según la búsqueda y filtros de columna
    const filteredItems = computed(() => {
      if (!props.items || !Array.isArray(props.items)) return [];
      
      let filtered = props.items;
      
      // Aplicar filtro de búsqueda general
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item => {
          return props.filterKeys.some((key) => {
            const value = String(item[key]).toLowerCase();
            return value.includes(query);
          });
        });
      }
      
      // Aplicar filtros de columna
      Object.entries(columnFilters.value).forEach(([columnKey, selectedValues]) => {
        if (selectedValues.length > 0) {
          filtered = filtered.filter(item => {
            const itemValue = String(item[columnKey] || '');
            return selectedValues.includes(itemValue);
          });
        }
      });
      
      return filtered;
    });

    // Ordenar los elementos según el sortKey y sortOrder
    const sortedItems = computed(() => {
      if (!sortKey.value) return filteredItems.value;
      
      // Encontrar el header correspondiente para obtener el tipo
      const header = props.headers.find(h => h.key === sortKey.value);
      const dataType = header?.type || 'string';
      
      return [...filteredItems.value].sort((a, b) => {
        const aValue = a[sortKey.value as keyof typeof a];
        const bValue = b[sortKey.value as keyof typeof b];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        
        switch (dataType) {
          case 'number':
            const numA = parseFloat(String(aValue));
            const numB = parseFloat(String(bValue));
            comparison = numA - numB;
            break;
            
          case 'date':
            const dateA = new Date(String(aValue));
            const dateB = new Date(String(bValue));
            comparison = dateA.getTime() - dateB.getTime();
            break;
            
          default: // 'string'
            comparison = String(aValue).localeCompare(String(bValue));
            break;
        }
        
        return sortOrder.value === 'asc' ? comparison : -comparison;
      });
    });

    // Paginación y ordenación
    const paginatedAndSortedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return sortedItems.value.slice(start, end);
    });

    const totalPages = computed(() => {
      const itemsLength = filteredItems.value ? filteredItems.value.length : 0;
      return Math.ceil(itemsLength / itemsPerPage.value);
    });

    const paginationPages = computed(() => {
      const pages: Array<number | string> = [];
      const total = totalPages.value;
      const current = currentPage.value;

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 2);

        if (current > 4) pages.push("...");

        const start = Math.max(3, current - 1);
        const end = Math.min(total - 2, current + 1);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (current < total - 3) pages.push("...");

        pages.push(total - 1, total);
      }

      return pages;
    });

    // Funciones para ordenar las columnas
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
    };

    // Funciones para filtros tipo Excel
    const getUniqueValues = (columnKey: string) => {
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
        filterSearchQuery.value = ''; // Limpiar búsqueda al cerrar
        return;
      }
      
      // Inicializar modo de filtrado
      initializeFilterMode(columnKey);
      
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Dimensiones estimadas del dropdown
      const dropdownWidth = 300; // ancho estimado del dropdown
      const dropdownHeight = 400; // altura estimada del dropdown
      
      // Dimensiones de la ventana
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calcular posición inicial
      let top = rect.bottom + window.scrollY + 2;
      let left = rect.left + window.scrollX;
      
      // Verificar si se sale por la derecha
      if (left + dropdownWidth > windowWidth) {
        // Posicionar desde la derecha del botón hacia la izquierda
        left = rect.right + window.scrollX - dropdownWidth;
        
        // Si aún se sale por la izquierda, centrar en pantalla
        if (left < 0) {
          left = (windowWidth - dropdownWidth) / 2;
        }
      }
      
      // Verificar si se sale por abajo
      if (top + dropdownHeight > window.scrollY + windowHeight) {
        // Posicionar arriba del botón
        top = rect.top + window.scrollY - dropdownHeight - 2;
        
        // Si aún se sale por arriba, ajustar para que quepa
        if (top < window.scrollY) {
          top = window.scrollY + 10; // Margen desde el top
        }
      }
      
      // Asegurar que no se salga por la izquierda
      if (left < 0) {
        left = 10; // Margen desde la izquierda
      }
      
      // Asegurar que no se salga por la derecha
      if (left + dropdownWidth > windowWidth) {
        left = windowWidth - dropdownWidth - 10; // Margen desde la derecha
      }
      
      filterDropdownPosition.value = {
        top: top,
        left: left
      };
      
      activeFilterDropdown.value = columnKey;
      filterSearchQuery.value = ''; // Limpiar búsqueda al cambiar de columna
      
      // Inicializar filtros si no existen
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = [];
      }

      // Dar focus al dropdown DESPUÉS de que se haya posicionado
      nextTick(() => {
        if (filterDropdownRef.value) {
          // Usar setTimeout para asegurar que el posicionamiento no se vea afectado
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
      
      // Resetear a la primera página cuando se aplican filtros
      currentPage.value = 1;
    };

    const selectAllFilterValues = (columnKey: string) => {
      const uniqueValues = getUniqueValues(columnKey);
      columnFilters.value[columnKey] = [...uniqueValues];
      currentPage.value = 1;
    };

    const clearAllFilterValues = (columnKey: string) => {
      columnFilters.value[columnKey] = [];
      currentPage.value = 1;
    };

    const closeFilterDropdown = () => {
      activeFilterDropdown.value = null;
      filterSearchQuery.value = ''; // Limpiar búsqueda al cerrar
    };

    const isFilterActive = (columnKey: string) => {
      return columnFilters.value[columnKey] && columnFilters.value[columnKey].length > 0;
    };

    // Nuevas funciones para el sistema de filtros mejorado
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
      
      const columnKey = activeFilterDropdown.value;
      const operation = numberFilterOperation.value[columnKey];
      const value = numberFilterValue.value[columnKey];
      const valueTo = numberFilterValueTo.value[columnKey];
      
      if (!operation) {
        clearNumberFilter(columnKey);
        return;
      }
      
      // Filtrar los items según la operación seleccionada
      let filteredItems = props.items.filter(item => {
        const itemValue = item[columnKey];
        const numValue = parseFloat(String(itemValue));
        
        if (operation === 'empty') {
          return itemValue === null || itemValue === undefined || itemValue === '';
        }
        
        if (operation === 'notEmpty') {
          return itemValue !== null && itemValue !== undefined && itemValue !== '';
        }
        
        if (isNaN(numValue)) return false;
        
        switch (operation) {
          case 'equals':
            return numValue === value;
          case 'notEquals':
            return numValue !== value;
          case 'greater':
            return numValue > value;
          case 'greaterEqual':
            return numValue >= value;
          case 'less':
            return numValue < value;
          case 'lessEqual':
            return numValue <= value;
          case 'between':
            return numValue >= value && numValue <= valueTo;
          default:
            return true;
        }
      });
      
      // Actualizar filtros de columna con los valores que cumplen la condición
      const validValues = filteredItems.map(item => String(item[columnKey] || ''));
      columnFilters.value[columnKey] = [...new Set(validValues)];
      currentPage.value = 1;
    };

    const clearNumberFilter = (columnKey: string) => {
      delete numberFilterOperation.value[columnKey];
      delete numberFilterValue.value[columnKey];
      delete numberFilterValueTo.value[columnKey];
      columnFilters.value[columnKey] = [];
      currentPage.value = 1;
    };

    // Funciones para filtros de texto
    const applyTextFilter = () => {
      if (!activeFilterDropdown.value) return;
      
      const columnKey = activeFilterDropdown.value;
      const searchText = textFilterValue.value[columnKey];
      const caseSensitive = textFilterCaseSensitive.value[columnKey] || false;
      
      if (!searchText) {
        clearTextFilter(columnKey);
        return;
      }
      
      // Filtrar items que contengan el texto buscado
      const filteredItems = props.items.filter(item => {
        const itemValue = String(item[columnKey] || '');
        const searchValue = caseSensitive ? searchText : searchText.toLowerCase();
        const targetValue = caseSensitive ? itemValue : itemValue.toLowerCase();
        
        return targetValue.includes(searchValue);
      });
      
      // Actualizar filtros de columna con los valores que contienen el texto
      const validValues = filteredItems.map(item => String(item[columnKey] || ''));
      columnFilters.value[columnKey] = [...new Set(validValues)];
      currentPage.value = 1;
    };

    const clearTextFilter = (columnKey: string) => {
      delete textFilterValue.value[columnKey];
      delete textFilterCaseSensitive.value[columnKey];
      columnFilters.value[columnKey] = [];
      currentPage.value = 1;
    };

    const setTextFilterValue = (value: string) => {
      if (!activeFilterDropdown.value) return;
      textFilterValue.value[activeFilterDropdown.value] = value;
      applyTextFilter();
    };

    // Función para cambiar el modo de filtrado
    const setFilterMode = (columnKey: string, mode: 'advanced' | 'checkbox') => {
      filterMode.value[columnKey] = mode;
      
      // Limpiar filtros cuando se cambia de modo
      if (mode === 'advanced') {
        // Limpiar filtros de checkbox
        columnFilters.value[columnKey] = [];
      } else {
        // Limpiar filtros avanzados
        clearNumberFilter(columnKey);
        clearTextFilter(columnKey);
      }
    };

    // Función para inicializar el modo de filtrado por defecto
    const initializeFilterMode = (columnKey: string) => {
      if (!filterMode.value[columnKey]) {
        // Por defecto usar modo checkbox para mantener compatibilidad
        filterMode.value[columnKey] = 'checkbox';
      }
    };

    // Función para contar resultados de filtros
    const getFilterResultCount = (columnKey: string) => {
      if (!activeFilterDropdown.value || activeFilterDropdown.value !== columnKey) return 0;
      
      const headerType = getHeaderType(columnKey);
      
      if (headerType === 'number') {
        const operation = numberFilterOperation.value[columnKey];
        const value = numberFilterValue.value[columnKey];
        const valueTo = numberFilterValueTo.value[columnKey];
        
        if (!operation) return 0;
        
        return props.items.filter(item => {
          const itemValue = item[columnKey];
          const numValue = parseFloat(String(itemValue));
          
          if (operation === 'empty') {
            return itemValue === null || itemValue === undefined || itemValue === '';
          }
          
          if (operation === 'notEmpty') {
            return itemValue !== null && itemValue !== undefined && itemValue !== '';
          }
          
          if (isNaN(numValue)) return false;
          
          switch (operation) {
            case 'equals':
              return numValue === value;
            case 'notEquals':
              return numValue !== value;
            case 'greater':
              return numValue > value;
            case 'greaterEqual':
              return numValue >= value;
            case 'less':
              return numValue < value;
            case 'lessEqual':
              return numValue <= value;
            case 'between':
              return numValue >= value && numValue <= valueTo;
            default:
              return true;
          }
        }).length;
        
      } else {
        // Para texto
        const searchText = textFilterValue.value[columnKey];
        const caseSensitive = textFilterCaseSensitive.value[columnKey] || false;
        
        if (!searchText) return 0;
        
        return props.items.filter(item => {
          const itemValue = String(item[columnKey] || '');
          const searchValue = caseSensitive ? searchText : searchText.toLowerCase();
          const targetValue = caseSensitive ? itemValue : itemValue.toLowerCase();
          
          return targetValue.includes(searchValue);
        }).length;
      }
    };

    // Funciones para selección múltiple
    const selectedItemsArray = computed(() => {
      return Array.from(selectedItems.value);
    });

    const selectedCount = computed(() => {
      return selectedItems.value.size;
    });

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        // Deseleccionar todos
        selectedItems.value.clear();
      } else {
        // Seleccionar todos los items de la página actual
        paginatedAndSortedItems.value.forEach(item => {
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
      const currentPageItemIds = paginatedAndSortedItems.value.map(item => item[props.itemIdKey]);
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
      // Limpiar foco de teclado cuando se usa el mouse
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
      
      if (event.ctrlKey) {
        isDragging.value = true;
        dragStartIndex.value = index;
        dragEndIndex.value = index;
        isCtrlPressed.value = true;
        
        // Capturar posición inicial para el selector visual usando las coordenadas de la página
        dragStartPosition.value = {
          x: event.pageX,
          y: event.pageY
        };
        
        // Inicializar selector visual en la posición exacta del click
        selectorPosition.value = {
          top: event.pageY,
          left: event.pageX,
          width: 0,
          height: 0
        };
        selectorVisible.value = true;
        
        // Prevenir selección de texto
        event.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.value || !isCtrlPressed.value) return;
      
      // Actualizar selector visual usando coordenadas de la página
      if (selectorVisible.value) {
        const currentX = event.pageX;
        const currentY = event.pageY;
        
        // Calcular posición y tamaño del selector
        const left = Math.min(dragStartPosition.value.x, currentX);
        const top = Math.min(dragStartPosition.value.y, currentY);
        const width = Math.abs(currentX - dragStartPosition.value.x);
        const height = Math.abs(currentY - dragStartPosition.value.y);
        
        selectorPosition.value = { left, top, width, height };
      }
      
      // Encontrar el índice de la fila sobre la que está el mouse
      const target = event.target as HTMLElement;
      const row = target.closest('tr');
      if (row && row.parentNode) {
        const tbody = row.parentNode as HTMLElement;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentIndex = rows.indexOf(row);
        
        if (currentIndex >= 0) {
          dragEndIndex.value = currentIndex;
          
          // Seleccionar rango visual temporalmente
          highlightRange();
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging.value && dragStartIndex.value !== null && dragEndIndex.value !== null) {
        selectRange(dragStartIndex.value, dragEndIndex.value);
      }
      
      // Limpiar estado de drag
      isDragging.value = false;
      dragStartIndex.value = null;
      dragEndIndex.value = null;
      isCtrlPressed.value = false;
      selectorVisible.value = false;
      isDeselecting.value = false;
      
      // Remover event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Limpiar highlights
      clearRangeHighlight();
    };

    const selectRange = (startIndex: number, endIndex: number) => {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      // Verificar si todos los items en el rango ya están seleccionados
      let allSelected = true;
      const rangeItems = [];
      
      for (let i = start; i <= end; i++) {
        if (i < paginatedAndSortedItems.value.length) {
          const item = paginatedAndSortedItems.value[i];
          rangeItems.push(item);
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
          }
        }
      }
      
      // Si todos están seleccionados, deseleccionar; si no, seleccionar
      if (allSelected && rangeItems.length > 0) {
        // Deseleccionar todos los items en el rango
        rangeItems.forEach(item => {
          selectedItems.value.delete(item[props.itemIdKey]);
        });
      } else {
        // Seleccionar todos los items en el rango
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
      
      // Limpiar highlights previos
      clearRangeHighlight();
      
      // Verificar si el rango está completamente seleccionado
      let allSelected = true;
      for (let i = start; i <= end; i++) {
        if (i < paginatedAndSortedItems.value.length) {
          const item = paginatedAndSortedItems.value[i];
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
            break;
          }
        }
      }
      
      // Actualizar estado de deselección
      isDeselecting.value = allSelected;
      
      // Agregar clase de highlight al rango
      const tbody = document.querySelector('tbody');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let i = start; i <= end && i < rows.length; i++) {
          rows[i].classList.add('drag-selecting');
          // Agregar clase adicional si todos están seleccionados (para deseleccionar)
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

      // Navegación con teclado solo si hay items y está habilitada la selección
      if (props.selectable && paginatedAndSortedItems.value.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            moveToNextRow();
            break;
          case 'ArrowUp':
            event.preventDefault();
            moveToPreviousRow();
            break;
          case ' ': // Barra espaciadora
            // Solo seleccionar si se presiona Ctrl + Espacio
            if (event.ctrlKey) {
              event.preventDefault();
              selectCurrentRow();
            }
            // Si no se presiona Ctrl, permitir el comportamiento normal (scroll)
            break;
          case 'Escape':
            // Cerrar dropdown de filtros si está abierto
            if (activeFilterDropdown.value) {
              closeFilterDropdown();
              event.preventDefault();
              return;
            }
            // Limpiar foco al presionar Escape
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
      if (focusedRowIndex.value < paginatedAndSortedItems.value.length - 1) {
        focusedRowIndex.value++;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      } else if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        // Si no hay fila enfocada, empezar en la primera
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
      } else if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        // Si no hay fila enfocada, empezar en la última
        focusedRowIndex.value = paginatedAndSortedItems.value.length - 1;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      }
    };

    const selectCurrentRow = () => {
      if (focusedRowIndex.value >= 0 && focusedRowIndex.value < paginatedAndSortedItems.value.length) {
        const currentItem = paginatedAndSortedItems.value[focusedRowIndex.value];
        const itemId = currentItem[props.itemIdKey];
        
        // Alternar selección: si está seleccionado, deseleccionar; si no, seleccionar
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
            targetRow.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }
      });
    };

    // Funciones para manejo de foco en la tabla
    const onTableFocus = () => {
      // Cuando la tabla recibe foco, activar la navegación por teclado si no hay fila enfocada
      if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        focusedRowIndex.value = 0;
        isKeyboardNavigation.value = true;
      }
    };

    const onTableClick = (event: MouseEvent) => {
      // Enfocar la tabla cuando se hace click en ella para habilitar navegación por teclado
      if (tableContainerRef.value) {
        tableContainerRef.value.focus();
      }
    };

    // Funciones para la paginación
    const changePage = (page: number | string) => {
      if (typeof page === 'number') {
        currentPage.value = page;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const filterData = () => {
      currentPage.value = 1;
      // Resetear foco cuando se filtren los datos
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
    };

    const resetPage = () => {
      currentPage.value = 1;
      // Resetear foco cuando se reinicie la página
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
    };

    // Funciones para altura automática
    const calculateAutoHeight = () => {
      if (!props.autoHeight) return;
      
      // Si está cargando y no se debe mostrar la tabla, no calcular altura
      if (props.loading && !props.hideLoading) {
        calculatedHeight.value = 'auto';
        return;
      }
      
      // Esperar a que el DOM se actualice
      nextTick(() => {
        if (!tableContainerRef.value) return;
        
        const container = tableContainerRef.value;
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calcular altura disponible desde la posición actual hasta el final de la pantalla
        const availableHeight = windowHeight - rect.top - props.heightOffset;
        
        // Asegurar que la altura mínima sea razonable
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

    // Lifecycle hooks para event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', handleResize);
      
      // Calcular altura inicial si autoHeight está habilitado
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

    // Watcher para recalcular altura cuando cambie autoHeight
    watch(() => props.autoHeight, (newValue) => {
      if (newValue) {
        calculateAutoHeight();
      } else {
        calculatedHeight.value = 'auto';
      }
    });

    // Watcher para recalcular altura cuando cambie el estado de loading
    watch(() => props.loading, (newValue) => {
      if (props.autoHeight) {
        // Si termina de cargar, recalcular altura
        if (!newValue) {
          nextTick(() => {
            calculateAutoHeight();
          });
        }
      }
    });

    // Watcher para recalcular altura cuando cambien los items (después de cargar datos)
    watch(() => props.items, () => {
      if (props.autoHeight && !props.loading) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
    });

    // Exposer métodos para el componente padre
    const limpiarSeleccion = () => {
      clearSelection();
    };

    const setKeyboardFocus = (index: number) => {
      focusedRowIndex.value = index;
      isKeyboardNavigation.value = true;
      scrollToFocusedRow();
    };

    return {
      searchQuery,
      itemsPerPage,
      itemsPerPageOptions,
      currentPage,
      totalPages,
      paginationPages,
      paginatedAndSortedItems,
      sortKey,
      sortOrder,
      sortBy,
      changePage,
      prevPage,
      nextPage,
      filterData,
      resetPage,
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
      // Nuevas funciones para filtros mejorados
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
      setTextFilterValue,
      // Control de modo de filtrado
      filterMode,
      setFilterMode,
      initializeFilterMode,
      getFilterResultCount,
      // Selección múltiple
      selectedItems,
      selectedItemsArray,
      selectedCount,
      isAllSelected,
      isIndeterminate,
      toggleSelectAll,
      toggleSelectItem,
      isItemSelected,
      clearSelection,
      // Selección por rango
      isDragging,
      handleMouseDown,
      // Selector visual
      selectorVisible,
      selectorPosition,
      isDeselecting,
      // Altura automática
      tableContainerRef,
      calculatedHeight,
      filterDropdownRef,
      // Navegación con teclado
      focusedRowIndex,
      isKeyboardNavigation,
      onTableFocus,
      onTableClick,
      // Métodos expuestos
      limpiarSeleccion,
      setKeyboardFocus,
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
  outline: none; /* Eliminar outline de focus */
}

.filter-dropdown-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.filter-dropdown-header h6 {
  margin: 0;
  flex: 1;
}

.btn-close-filter {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-search-container {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}

.filter-search-container input {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-actions {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.filter-values {
  padding: 8px 0;
  max-height: 250px;
  overflow-y: auto;
}

.filter-value-item {
  padding: 4px 16px;
}

/* Estilos para las pestañas de filtrado */
.filter-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.filter-tab {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.filter-tab:hover {
  background-color: #e9ecef;
  color: #495057;
}

.filter-tab.active {
  color: #007bff;
  background-color: #ffffff;
  border-bottom-color: #007bff;
}

/* Estilos para el contenedor de filtros checkbox */
.checkbox-filter-container {
  /* Mantiene los estilos del filtro tradicional */
  padding: 0;
}

/* Estilos para filtros numéricos mejorados */
.number-filter-container {
  padding: 16px;
}

.number-filter-container .form-label {
  color: #495057;
  font-weight: 500;
  margin-bottom: 4px;
}

.number-filter-container .form-select,
.number-filter-container .form-control {
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.number-filter-container .form-select:focus,
.number-filter-container .form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Estilos para filtros de texto mejorados */
.text-filter-container {
  padding: 16px;
}

.text-filter-container .form-label {
  color: #495057;
  font-weight: 500;
  margin-bottom: 4px;
}

.text-filter-container .form-control {
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
}

.text-filter-container .form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.text-filter-container .form-check-input {
  margin-top: 0.125rem;
}

.text-filter-container .form-check-label {
  color: #6c757d;
  font-size: 0.875rem;
}

/* Estilos para la lista de valores únicos de referencia */
.unique-values-reference {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.unique-values-reference .form-label {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.unique-values-list {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.unique-value-item {
  padding: 4px 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.unique-value-item:hover {
  background-color: #e9ecef;
}

.unique-value-item:last-child {
  border-bottom: none;
}

/* Estilos para el contador de resultados */
.filter-result-count {
  padding: 8px 12px;
  background-color: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
  text-align: center;
}

.filter-result-count .text-muted {
  color: #0066cc !important;
  font-weight: 500;
}

.filter-value-item:hover {
  background-color: #f8f9fa;
}

.filter-value-item label {
  cursor: pointer;
  margin: 0;
  width: 100%;
  font-size: 0.9em;
}

.filter-no-results {
  padding: 16px;
  text-align: center;
  font-style: italic;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1040;
  background: transparent;
}

th.sortable {
  white-space: pre-line;
}
tbody > tr> td {
  padding: 0 !important;
}

.table-container {
  position: relative;
}

/* Estilos para selección por rango */
.drag-selecting {
  background-color: rgba(0, 123, 255, 0.2) !important;
  transition: background-color 0.1s ease;
}

.drag-deselecting {
  background-color: rgba(255, 0, 0, 0.2) !important;
  transition: background-color 0.1s ease;
}

.drag-selector {
  background-color: rgba(0, 123, 255, 0.1);
  border: 2px dashed #007bff;
  pointer-events: none;
  box-sizing: border-box;
}

/* Selector visual cuando va a deseleccionar */
.drag-selector.deselecting {
  background-color: rgba(255, 0, 0, 0.1);
  border: 2px dashed #dc3545;
}

tbody tr {
  cursor: pointer;
  user-select: none;
}

tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Estilos para navegación con teclado */
tbody tr.keyboard-focused {
  background-color: #fef3c7 !important; /* bg-yellow-100 equivalent */
  /* border: 1px solid #f9ba4e !important; */
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3) !important;
  position: relative !important;
  z-index: 10 !important;
}

tbody tr.keyboard-focused:hover {
  background-color: #fde68a !important; /* bg-yellow-200 equivalent */
}

/* Asegurar que el fondo amarillo sea visible por encima de otros estilos */
tbody tr.keyboard-focused td {
  background-color: inherit !important;
}

/* Mejorar el contraste del foco */
.table-container {
  transition: outline 0.2s ease;
}

</style>
