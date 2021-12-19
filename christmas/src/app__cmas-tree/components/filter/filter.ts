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

  public static extremaDots = {
    year: { min: 0, max: 0 },
  };

  constructor(data: DataItems) {
    super({ isExist: false, tag: Filter.ClassNames.containerTag });
    this.container?.classList.add(Filter.ClassNames.containerClassName);
    this.parseFromTemplate(html);
    this.data = data;
    this.defaultData = data;
    this.countYears(data);
  }

  private countYears(arr: DataItems): void {
    const births: Set<number> = new Set();
    arr.forEach((item) => births.add(+item.year));
    const birthsSorted = [...births].sort((a, b) => (a < b ? -1 : 1));
    Filter.extremaDots.year.min = birthsSorted[0];
    Filter.extremaDots.year.max = birthsSorted[birthsSorted.length - 1];
  }

  addDoubleSlider(): void {
    const doubleYearSlider = <target>document.querySelector('.double-filter__slider');
    const minBirth = Filter.extremaDots.year.min;
    const maxBirth = Filter.extremaDots.year.max;
    noUiSlider.create(doubleYearSlider, {
      start: [minBirth, maxBirth],
      tooltips: {
        to: (value) => Math.round(value),
      },
      animate: false,
      connect: true,
      range: {
        min: minBirth,
        max: maxBirth,
      },
    });

    if (doubleYearSlider.noUiSlider) {
      this.addDataUpdater(doubleYearSlider.noUiSlider);
    }
  }

  private addDataUpdater(slider: API): void {
    slider.on('change', () => {
      const actualExtrema = <Array<number>>slider.get(true);
      this.data = this.defaultData.filter((item) => +item.year >= actualExtrema[0] && +item.year <= actualExtrema[1]);
      this.updateFilteredContent();
    });
  }

  private updateFilteredContent() {
    const newCatalogContent = new Catalog();
    newCatalogContent.updateCatalog(this.data);
  }
}
