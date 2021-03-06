import html from './filter.html';
import './filter.scss';
import * as noUiSlider from 'nouislider';
import { target, API } from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { Component } from '../../templates/component';
import { DataItems } from '../data-grabber/data-grabber';
import { Catalog } from '../../pages/catalog';
import { Search } from '../search/search';

export class Filter extends Component {
  static readonly ClassNames = {
    containerTag: 'sidebar',
    containerClassName: 'catalog-sidebar',
  };

  private search: Search;

  private data: DataItems;

  private defaultData: DataItems;

  private static extremaDots = <
    { [prop: string]: { min: number; max: number } }
  >{
    count: { min: 0, max: 0 },
    year: { min: 0, max: 0 },
  };

  private static valuesCollection = <{ [prop: string]: Array<string> }>{
    shape: [],
    color: [],
    size: [],
  };

  private static filtersConfig = <
    { [prop: string]: Array<number | string | boolean> }
  >{
    count: [],
    year: [],
    shape: [],
    color: [],
    size: [],
    sorter: [],
    favorites: [false],
    search: [''],
  };

  // private static Dictionary = new Map([
  //   ['желтый', 'yellow'],
  //   ['зелёный', 'green'],
  //   ['красный', 'red'],
  //   ['белый', 'white'],
  //   ['синий', 'darkblue'],
  //   ['шар', 'ball'],
  //   ['фигурка', 'figure'],
  //   ['колокольчик', 'bell'],
  //   ['шишка', 'cone'],
  //   ['снежинка', 'snowflake'],
  //   ['большой', 'xl'],
  //   ['средний', 'm'],
  //   ['малый', 's'],
  //   ['shape', 'Shape'],
  //   ['color', 'Color'],
  //   ['size', 'Size'],
  // ]);

  private static Dictionary = new Map([
    ['yellow', 'yellow'],
    ['green', 'green'],
    ['red', 'red'],
    ['white', 'white'],
    ['blue', 'darkblue'],
    ['ball', 'ball'],
    ['figure', 'figure'],
    ['bell', 'bell'],
    ['cone', 'cone'],
    ['snowflake', 'snowflake'],
    ['big', 'xl'],
    ['medium', 'm'],
    ['small', 's'],
    ['shape', 'Shape'],
    ['color', 'Color'],
    ['size', 'Size'],
  ]);

  constructor(data: DataItems) {
    super({
      isExist: false,
      className: Filter.ClassNames.containerClassName,
      tag: Filter.ClassNames.containerTag,
    });
    this.data = data;
    this.defaultData = data;
    this.grubExtremaForDoubleSliders(data);
    this.grubValuesForValuesCollection(data);
    this.search = new Search();
  }

  private grubExtremaForDoubleSliders(arr: DataItems): void {
    Object.keys(Filter.extremaDots).forEach((extremum) => {
      const allValues: Set<number> = new Set();
      arr.forEach((item) => allValues.add(+item[extremum]));
      const allValuesSorted = [...allValues].sort((a, b) => (a < b ? -1 : 1));
      Filter.extremaDots[extremum].min = allValuesSorted[0];
      Filter.extremaDots[extremum].max =
        allValuesSorted[allValuesSorted.length - 1];
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
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private addValueFiltersListener(parent: HTMLElement): void {
    parent.addEventListener('click', (e) => {
      const clickTarget = <HTMLElement>e.target;
      const isProper = clickTarget.classList.contains('value-filter__item');
      const isActive = clickTarget.classList.contains(
        'value-filter__item_active',
      );
      if (isProper) {
        const filterType = clickTarget.dataset.filterType;
        const filterValue = clickTarget.dataset.filterValue;
        if (isActive) {
          clickTarget.classList.toggle('value-filter__item_active');
          if (filterType && filterValue) {
            Filter.filtersConfig[filterType] = Filter.filtersConfig[
              filterType
            ].filter((item) => item !== filterValue);
          }
        } else {
          clickTarget.classList.toggle('value-filter__item_active');
          if (filterType && filterValue) {
            Filter.filtersConfig[filterType].push(filterValue);
          }
        }
      }
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private dataChanger(): void {
    const sortIt = (arr: DataItems): DataItems => {
      const params = ('' + Filter.filtersConfig.sorter[0]).split('-');
      if (params[0] === 'count') {
        if (params[1] === 'ascending') {
          return arr.sort((a, b) => {
            return +a[params[0]] > +b[params[0]] ? 1 : -1;
          });
        } else {
          return arr.sort((a, b) => {
            return +a[params[0]] < +b[params[0]] ? 1 : -1;
          });
        }
      } else {
        if (params[1] === 'ascending') {
          return arr.sort((a, b) => {
            return a[params[0]] > b[params[0]] ? 1 : -1;
          });
        } else {
          return arr.sort((a, b) => {
            return a[params[0]] < b[params[0]] ? 1 : -1;
          });
        }
      }
    };

    const isFavoriteList = (arr: DataItems): DataItems => {
      if (Filter.filtersConfig.favorites[0]) {
        const favList = JSON.parse(localStorage.cart);
        return arr.filter((toy) => favList.some((id: string) => toy.id === id));
      }
      return arr;
    };

    const searchFilterIt = (arr: DataItems): DataItems => {
      const searchValue = <string>Filter.filtersConfig.search[0];
      if (searchValue.length > 0) {
        return arr.filter((item) => {
          if (typeof item.name === 'string') {
            return item.name.toLowerCase().includes(searchValue.toLowerCase());
          }
        });
      }
      return arr;
    };

    const filterIt = (arr: DataItems, prop: string): DataItems => {
      if (Filter.filtersConfig[prop].length === 0) return arr;
      if (prop === 'count' || prop === 'year') {
        return arr.filter(
          (item) =>
            +item[prop] >= Filter.filtersConfig[prop][0] &&
            +item[prop] <= Filter.filtersConfig[prop][1],
        );
      } else if (prop === 'sorter') {
        return sortIt(arr);
      } else if (prop === 'favorites') {
        return isFavoriteList(arr);
      } else if (prop === 'search') {
        return searchFilterIt(arr);
      } else {
        return arr.filter((item) =>
          Filter.filtersConfig[prop].some((_item) => _item === item[prop]),
        );
      }
    };

    Object.keys(Filter.filtersConfig).forEach((filterName, index) => {
      if (index === 0) {
        this.data = filterIt(this.defaultData, filterName);
      } else {
        this.data = filterIt(this.data, filterName);
      }
    });

    this.saveUserSettingsToLocal();
  }

  private updateFilteredContent(): void {
    const newCatalogContent = new Catalog();
    newCatalogContent.updateCatalog(this.data);
  }

  private addDoubleSliders(): void {
    const doubleSliders = <Array<target>>(
      (<unknown>this.container?.querySelectorAll('.double-filter__slider'))
    );
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

  private addValueFilters(): void {
    const valueFiltersContainer = <HTMLElement>(
      this.container?.querySelector(
        '.sidebar-catalog__navigation__value-filters',
      )
    );
    Object.keys(Filter.valuesCollection).forEach((collectionName) => {
      const valueFilter = document.createElement('li');
      valueFilter.classList.add(
        `sidebar-catalog__navigation__value-filters__${collectionName}-filter`,
        `${collectionName}-filter`,
      );
      valueFilter.innerHTML = `<h3 class="filter-header ${collectionName}-filter__header">Toys ${Filter.Dictionary.get(
        collectionName,
      )}</h3>`;
      const valueFilterList = document.createElement('ul');
      valueFilterList.classList.add(
        `sidebar-catalog__navigation__value-filters__${collectionName}-filter__items`,
        `${collectionName}-filter__items`,
        'value-filter__items',
      );
      Filter.valuesCollection[collectionName].forEach((filterValue) => {
        const valueFilterItem = document.createElement('li');
        valueFilterItem.classList.add(
          'value-filter__item',
          `value-filter__item_${Filter.Dictionary.get(filterValue)}`,
        );
        valueFilterItem.title = `By filter ${Filter.Dictionary.get(
          collectionName,
        )} select ${filterValue}`;
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

  private addSorter(): void {
    const sorterList = <HTMLInputElement>(
      this.container?.querySelector('.sorter__select-list')
    );
    sorterList?.addEventListener('change', () => {
      Filter.filtersConfig.sorter[0] = sorterList.value;
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private showFavorites(): void {
    const favoritesInput = <HTMLInputElement>(
      this.container?.querySelector('.favorites-selector__checkbox')
    );
    favoritesInput?.addEventListener('change', () => {
      Filter.filtersConfig.favorites[0] = favoritesInput.checked;
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private resetTags(): void {
    const doubleSliders = <Array<target>>(
      (<unknown>this.container?.querySelectorAll('.double-filter__slider'))
    );
    const valueFilterItems = <Array<HTMLElement>>(
      (<unknown>this.container?.querySelectorAll('.value-filter__item'))
    );
    doubleSliders.forEach((slider) => slider.noUiSlider?.reset());
    valueFilterItems.forEach((valueItem) =>
      valueItem.classList.remove('value-filter__item_active'),
    );
  }

  private addResetListener(): void {
    const resetButton = <HTMLInputElement>(
      this.container?.querySelector(
        '.sidebar-catalog__navigation__reset__button',
      )
    );
    resetButton.addEventListener('click', () => {
      Object.keys(Filter.filtersConfig).forEach((item) => {
        if (item !== 'sorter' && item !== 'favorites') {
          Filter.filtersConfig[item] = [];
        }
      });
      this.resetTags();
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private addResetAllListener(): void {
    const resetAllButton = <HTMLInputElement>(
      this.container?.querySelector(
        '.sidebar-catalog__navigation__reset-all__button',
      )
    );
    resetAllButton.addEventListener('click', () => {
      Object.keys(Filter.filtersConfig).forEach((item) => {
        if (item === 'sorter') {
          Filter.filtersConfig[item] = [''];
          this.setSorter();
        } else if (item === 'favorites') {
          Filter.filtersConfig[item] = [false];
          this.setFavorites();
        } else if (item === 'search') {
          Filter.filtersConfig[item] = [''];
        } else {
          Filter.filtersConfig[item] = [];
        }
      });
      this.resetTags();
      this.dataChanger();
      this.updateFilteredContent();
    });
  }

  private addSearchListener(): void {
    const search = this.search.getContent();
    const searchCleaner = search?.nextElementSibling;

    const update = (str: string) => {
      Filter.filtersConfig.search[0] = str;
      this.dataChanger();
      this.updateFilteredContent();
    };

    const searchClean = () => {
      if (search instanceof HTMLInputElement) {
        search.value = '';
        update(search.value);
        searchCleaner?.classList.remove('search__input__icon_close');
      }
    };

    search?.addEventListener('input', () => {
      if (search instanceof HTMLInputElement) {
        if (search?.value.length > 0) {
          searchCleaner?.classList.add('search__input__icon_close');
          searchCleaner?.addEventListener('click', searchClean);
        } else {
          searchCleaner?.classList.remove('search__input__icon_close');
          searchCleaner?.removeEventListener('click', searchClean);
        }
        update(search.value);
      }
    });
  }

  private saveUserSettingsToLocal(): void {
    localStorage.userSettings = JSON.stringify(Filter.filtersConfig);
  }

  private getUserSettingsFromLocal(): void {
    Filter.filtersConfig = localStorage.userSettings
      ? JSON.parse(localStorage.userSettings)
      : Filter.filtersConfig;
  }

  private setDoubleSlider(key: string): void {
    const doubleSlider = <target>(
      this.container?.querySelector(`.${key}-filter__slider`)
    );
    if (Filter.filtersConfig[key].length > 0) {
      doubleSlider.noUiSlider?.set(<Array<number>>Filter.filtersConfig[key]);
    }
  }

  private setValueFilters(key: string): void {
    const keyItems = <Array<HTMLElement>>(
      (<unknown>this.container?.querySelectorAll('.value-filter__item'))
    );
    if (Filter.filtersConfig[key].length > 0) {
      keyItems?.forEach((item) => {
        const filterType = item.dataset.filterType;
        const filterValue = item.dataset.filterValue;
        if (filterType && filterValue) {
          if (
            Filter.filtersConfig[filterType].some(
              (_item) => _item === filterValue,
            )
          ) {
            item.classList.add('value-filter__item_active');
          }
        }
      });
    }
  }

  private setSorter(): void {
    const sorterList = <HTMLInputElement>(
      this.container?.querySelector('.sorter__select-list')
    );
    if (Filter.filtersConfig.sorter.length > 0) {
      sorterList.value = <string>Filter.filtersConfig.sorter[0];
    } else {
      sorterList.value = '';
    }
  }

  private setFavorites(): void {
    const checkbox = <HTMLInputElement>(
      this.container?.querySelector('.favorites-selector__checkbox')
    );
    checkbox.checked = <boolean>Filter.filtersConfig.favorites[0];
  }

  private firstStartCheckItems(): void {
    Object.keys(Filter.filtersConfig).forEach((key) => {
      if (key === 'count' || key === 'year') {
        this.setDoubleSlider(key);
      } else if (key === 'shape' || key === 'color' || key === 'size') {
        this.setValueFilters(key);
      } else if (key === 'sorter') {
        this.setSorter();
      } else if (key === 'favorites') {
        this.setFavorites();
      }
    });
  }

  private firstStart() {
    this.getUserSettingsFromLocal();
    this.firstStartCheckItems();
    this.dataChanger();
    this.updateFilteredContent();
  }

  getContent(): HTMLElement | null {
    this.parseFromTemplate(html);
    this.addDoubleSliders();
    this.addValueFilters();
    this.addSorter();
    this.showFavorites();
    this.addResetListener();
    this.addResetAllListener();
    this.addSearchListener();
    this.firstStart();
    return this.container;
  }
}
