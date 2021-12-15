// import html from './catalog-item.html';
import './catalog-item.scss';
import { Component } from '../../templates/component';

type DataItems = Array<{
  [prop: string]: string | boolean;
  id: string;
  favorite: boolean;
}>;

export class CatalogItem extends Component {
  static readonly ClassNames = {
    container: 'catalog',
    containerTag: 'ul',
  };

  private itemsList: DataItems | undefined;

  private pathToData: string | undefined;

  constructor(path: string) {
    super({ isExist: false, tag: CatalogItem.ClassNames.containerTag });
    this.container?.classList.add('catalog-items');
    this.pathToData = path;
  }

  private async fetchData(path: string): Promise<DataItems> {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  }

  private async genList(): Promise<void> {
    if (this.pathToData) {
      this.itemsList = await this.fetchData(this.pathToData);
    }
    this.itemsList?.forEach((item) => {
      const card = <HTMLElement>document.createElement('li');
      card.classList.add('catalog-items__card', 'card');
      card.dataset.card = item.id;
      card.innerHTML = `
          <h3 class="card__header">${item.name}</h3>
          <dl class="card__characteristics">
            <dt>На складе:</dt><dd>${item.count}</dd>
            <dt>Год выпуска:</dt><dd>${item.year}</dd>
            <dt>Форма:</dt><dd>${item.shape}</dd>
            <dt>Цвет:</dt><dd>${item.color}</dd>
            <dt>Размер:</dt><dd>${item.size}</dd>
          </dl>
      `;
      if (item.favorite) {
        card.classList.add('card_favorite');
      }
      this.container?.appendChild(card);
    });
  }

  getContent(): HTMLElement | null {
    this.genList();
    return this.container;
  }

  show() {}
}
