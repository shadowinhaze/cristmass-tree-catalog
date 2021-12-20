import html from './filter.html';
import './filter.scss';
import * as noUiSlider from 'nouislider';
import { target, API } from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { Component } from '../../templates/component';
import { DataItems } from '../data-grabber/data-grabber';
import { Catalog } from '../../pages/catalog';

export class Filter extends Component {
  static readonly ClassNames = {
    containerTag: 'sidebar',
    containerClassName: 'catalog-sidebar',
  };

  private data: DataItems;

  private defaultData: DataItems;

  private static extremaDots = <{ [prop: string]: { min: number; max: number } }>{
    count: { min: 0, max: 0 },
    year: { min: 0, max: 0 },
  };

  private static valuesCollection = <{ [prop: string]: Array<string> }>{
    shape: [],
    color: [],
    size: [],
  };

  private static filtersConfig = <{ [prop: string]: Array<number | string> }>{
    count: [],
    year: [],
    shape: [],
    color: [],
    size: [],
  };

  constructor(data: DataItems) {
    super({ isExist: false, tag: Filter.ClassNames.containerTag });
    this.container?.classList.add(Filter.ClassNames.containerClassName);
    this.data = data;
    this.defaultData = data;
    this.grubExtremaForDoubleSliders(data);
    this.grubValuesForValuesCollection(data);
  }

  private grubExtremaForDoubleSliders(arr: DataItems): void {
    Object.keys(Filter.extremaDots).forEach((extremum) => {
      const allValues: Set<number> = new Set();
      arr.forEach((item) => allValues.add(+item[extremum]));
      const allValuesSorted = [...allValues].sort((a, b) => (a < b ? -1 : 1));
      Filter.extremaDots[extremum].min = allValuesSorted[0];
      Filter.extremaDots[extremum].max = allValuesSorted[allValuesSorted.length - 1];
    });
  }

  private grubValuesForValuesCollection(arr: DataItems): void {
    Object.keys(Filter.valuesCollection).forEach((collectionName) => {
      const allValues: Set<string> = new Set();
      arr.forEach((item) => allValues.add('' + item[collectionName]));
      Filter.valuesCollection[collectionName] = [...allValues];
    });
  }

  private genDoubleSlider(element: target, min: number, max: number): void {
    noUiSlider.create(element, {
      start: [min, max],
      tooltips: {
        to: (value) => Math.round(value),
      },
      animate: false,
      connect: true,
      range: {
        min: min,
        max: max,
      },
    });
  }

  private addDataUpdater(slider: API, prop: string): void {
    slider.on('change', () => {
      let actualValues = <Array<number>>slider.get(true);
      actualValues = actualValues.map((item) => Math.round(item));
      Filter.filtersConfig[prop] = actualValues;
      this.dataFilter();
      this.updateFilteredContent();
    });
  }

  private addValueFiltersListener(parent: HTMLElement): void {
    parent.addEventListener('click', (e) => {
      const clickTarget = <HTMLElement>e.target;
      const isProper = clickTarget.classList.contains('value-filter__item');
      const isActive = clickTarget.classList.contains('value-filter__item_active');
      if (isProper) {
        const filterType = clickTarget.dataset.filterType;
        const filterValue = clickTarget.dataset.filterValue;
        if (isActive) {
          clickTarget.classList.toggle('value-filter__item_active');
          if (filterType && filterValue) {
            Filter.filtersConfig[filterType] = Filter.filtersConfig[filterType].filter((item) => item !== filterValue);
          }
        } else {
          clickTarget.classList.toggle('value-filter__item_active');
          if (filterType && filterValue) {
            Filter.filtersConfig[filterType].push(filterValue);
          }
        }
      }
      this.dataFilter();
      this.updateFilteredContent();
    });
  }

  private dataFilter(): void {
    const filterIt = (arr: DataItems, prop: string): DataItems => {
      if (Filter.filtersConfig[prop].length === 0) return arr;
      if (prop === 'count' || prop === 'year') {
        return arr.filter(
          (item) => +item[prop] >= Filter.filtersConfig[prop][0] && +item[prop] <= Filter.filtersConfig[prop][1]
        );
      } else {
        return arr.filter((item) => Filter.filtersConfig[prop].some((_item) => _item === item[prop]));
      }
    };

    Object.keys(Filter.filtersConfig).forEach((filterName, index) => {
      if (index === 0) {
        this.data = filterIt(this.defaultData, filterName);
      } else {
        this.data = filterIt(this.data, filterName);
      }
    });
  }

  private updateFilteredContent(): void {
    const newCatalogContent = new Catalog();
    newCatalogContent.updateCatalog(this.data);
  }

  private addDoubleSliders(): void {
    const doubleSliders = <Array<target>>(<unknown>this.container?.querySelectorAll('.double-filter__slider'));
    doubleSliders.forEach((slider) => {
      Object.keys(Filter.extremaDots).forEach((extremum) => {
        if (slider.classList.contains(`${extremum}-filter__slider`)) {
          const min = Filter.extremaDots[extremum].min;
          const max = Filter.extremaDots[extremum].max;
          this.genDoubleSlider(slider, min, max);
          if (slider.noUiSlider) {
            this.addDataUpdater(slider.noUiSlider, extremum);
          }
        }
      });
    });
  }

  private valueTranslator(value: string): string {
    switch (value) {
      case 'желтый':
        return 'yellow';
      case 'зелёный':
        return 'green';
      case 'красный':
        return 'red';
      case 'белый':
        return 'white';
      case 'синий':
        return 'darkblue';
      case 'шар':
        return 'ball';
      case 'фигурка':
        return 'figure';
      case 'колокольчик':
        return 'bell';
      case 'шишка':
        return 'cone';
      case 'снежинка':
        return 'snowflake';
      case 'большой':
        return 'xl';
      case 'средний':
        return 'm';
      case 'малый':
        return 's';
      case 'shape':
        return 'Форма';
      case 'color':
        return 'Цвет';
      case 'size':
        return 'Размер';
    }

    return '';
  }

  private addValueFilters(): void {
    const valueFiltersContainer = <HTMLElement>(
      this.container?.querySelector('.sidebar-catalog__navigation__value-filters')
    );
    Object.keys(Filter.valuesCollection).forEach((collectionName) => {
      const valueFilter = document.createElement('li');
      valueFilter.classList.add(
        `sidebar-catalog__navigation__value-filters__${collectionName}-filter`,
        `${collectionName}-filter`,
        'list-filter'
      );
      valueFilter.innerHTML = `<h3 class="filter-header ${collectionName}-filter__header">${this.valueTranslator(
        collectionName
      )} игрушек</h3>`;
      const valueFilterList = document.createElement('ul');
      valueFilterList.classList.add(
        `sidebar-catalog__navigation__value-filters__${collectionName}-filter__items`,
        `${collectionName}-filter__items`,
        'value-filter__items'
      );
      Filter.valuesCollection[collectionName].forEach((filterValue) => {
        const valueFilterItem = document.createElement('li');
        valueFilterItem.classList.add('value-filter__item', `value-filter__item_${this.valueTranslator(filterValue)}`);
        valueFilterItem.title = `Фильтром ${this.valueTranslator(collectionName)} выбрать ${filterValue}`;
        valueFilterItem.dataset.filterType = collectionName;
        valueFilterItem.dataset.filterValue = filterValue;
        valueFilterList.appendChild(valueFilterItem);
      });
      valueFilter.appendChild(valueFilterList);
      valueFiltersContainer?.appendChild(valueFilter);
    });
    if (valueFiltersContainer) {
      this.addValueFiltersListener(valueFiltersContainer);
    }
  }

  getContent(): HTMLElement | null {
    this.parseFromTemplate(html);
    this.addDoubleSliders();
    this.addValueFilters();
    return this.container;
  }
}
