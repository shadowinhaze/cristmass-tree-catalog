// import html from './catalog-item.html';
import './catalog-item.scss';
import { Component } from '../../templates/component';
import { Cart } from '../cart/cart';
import { DataItems } from '../data-grabber/data-grabber';

export class CatalogItems extends Component {
  static readonly ClassNames = {
    container: 'catalog',
    containerTag: 'ul',
  };

  static readonly CardStructure = {
    cardTag: 'li',
    cardClassName: 'toy-card',
    cardBemClassName: 'catalog-toys__toy-card',
    favoriteCardClassName: 'toy-card_favorite',
    cardImgPath: './assets/img/toys/',
  };

  private itemsList: DataItems;

  private cart: Cart;

  constructor(items: DataItems, cart: Cart) {
    super({ isExist: false, tag: CatalogItems.ClassNames.containerTag });
    this.container?.classList.add('catalog-toys');
    this.itemsList = items;
    this.cart = cart;
  }

  private async genList(): Promise<void> {
    this.itemsList.forEach((item) => {
      const card = <HTMLElement>document.createElement(CatalogItems.CardStructure.cardTag);
      card.classList.add(CatalogItems.CardStructure.cardBemClassName, CatalogItems.CardStructure.cardClassName);
      card.style.backgroundImage = `url("${CatalogItems.CardStructure.cardImgPath}${item.id}.png")`;
      card.dataset.cardId = item.id;

      card.innerHTML = `
      <h3 class="toy-card__header">${item.name}</h3>
      <label class="toy-card__favorites" title="Довить в избранное">
      <input type="checkbox" class="toy-card__favorites__checkbox"><i class="toy-card__favorites__icon fa fa-star"></i>
      </label>
      <dl class="toy-card__characteristics">
      <dt class="toy-card__characteristics__count-title characteristics__title">На складе</dt>
      <dd class="toy-card__characteristics__count-defenition characteristics__defenition">${item.count}</dd>
      <dt class="toy-card__characteristics__year-title characteristics__title">Год выпуска</dt>
      <dd class="toy-card__characteristics__year-defenition characteristics__defenition">${item.year}</dd>
      <dt class="toy-card__characteristics__shape-title characteristics__title">Форма</dt>
      <dd class="toy-card__characteristics__shape-defenition characteristics__defenition">${item.shape}</dd>
      <dt class="toy-card__characteristics__color-title characteristics__title">Цвет</dt>
      <dd class="toy-card__characteristics__color-defenition characteristics__defenition">${item.color}</dd>
      <dt class="toy-card__characteristics__size-title characteristics__title">Размер</dt>
      <dd class="toy-card__characteristics__size-defenition characteristics__defenition">${item.size}</dd>
      </dl>
      `;

      if (this.cart.cart?.has(item.id)) this.changeCatalogItemStatus(card, true);
      this.container?.appendChild(card);
    });

    this.addSavingDevice(
      this.container,
      CatalogItems.CardStructure.cardClassName,
      CatalogItems.CardStructure.favoriteCardClassName
    );
  }

  private changeCatalogItemStatus(item: HTMLElement, activate: boolean): void {
    const star = <HTMLInputElement>item.querySelector('.toy-card__favorites__checkbox');
    if (activate) {
      item.classList.add(CatalogItems.CardStructure.favoriteCardClassName);
      star.checked = true;
    } else {
      item.classList.remove(CatalogItems.CardStructure.favoriteCardClassName);
      star.checked = false;
    }
  }

  private addSavingDevice(parent: HTMLElement | null, targetClassName: string, favClassName: string): void {
    parent?.addEventListener(
      'click',
      (event: Event): void => {
        event.preventDefault();
        const target = <HTMLElement>event.target;
        const card = <HTMLElement>target.closest(CatalogItems.CardStructure.cardTag) || target;
        const properCard = card.classList.contains(targetClassName);
        const isFavoriteCard = card.classList.contains(favClassName);
        if (properCard) {
          const cardId = <string>card.dataset.cardId;
          if (isFavoriteCard) {
            this.cart.updateCart(cardId, 'decr');
            this.changeCatalogItemStatus(card, false);
          } else {
            this.cart.updateCart(cardId, 'incr');
            this.changeCatalogItemStatus(card, true);
          }
        }
      },
      true
    );
  }

  getContent(): HTMLElement | null {
    this.genList();
    return this.container;
  }

  show() {}
}
