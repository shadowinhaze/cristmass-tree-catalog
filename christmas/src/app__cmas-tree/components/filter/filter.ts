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

  public static extremaDots = <{ [prop: string]: { min: number; max: number } }>{
    count: { min: 0, max: 0 },
    year: { min: 0, max: 0 },
  };

  public static filtersConfig = <{ [prop: string]: Array<number> }>{
    count: [],
    year: [],
  };

  constructor(data: DataItems) {
    super({ isExist: false, tag: Filter.ClassNames.containerTag });
    this.container?.classList.add(Filter.ClassNames.containerClassName);
    this.data = data;
    this.defaultData = data;
    this.countExtremaForDoubleSliders(data);
  }

  private countExtremaForDoubleSliders(arr: DataItems): void {
    Object.keys(Filter.extremaDots).forEach((extremum) => {
      const allValues: Set<number> = new Set();
      arr.forEach((item) => allValues.add(+item[extremum]));
      const allValuesSorted = [...allValues].sort((a, b) => (a < b ? -1 : 1));
      Filter.extremaDots[extremum].min = allValuesSorted[0];
      Filter.extremaDots[extremum].max = allValuesSorted[allValuesSorted.length - 1];
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

  private dataFilter(): void {
    const filterIt = (arr: DataItems, prop: string): DataItems => {
      if (Filter.filtersConfig[prop].length === 0) return arr;
      return arr.filter(
        (item) => +item[prop] >= Filter.filtersConfig[prop][0] && +item[prop] <= Filter.filtersConfig[prop][1]
      );
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

  getContent(): HTMLElement | null {
    this.parseFromTemplate(html);
    this.addDoubleSliders();
    return this.container;
  }
}
