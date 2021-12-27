import cardHtml from './catalog-item.html';
import './catalog-item.scss';
import { Component } from '../../templates/component';
import { Cart } from '../cart/cart';
import { DataItems } from '../data-grabber/data-grabber';
import { Message } from '../message/message';
import { ChristmasAppPathsAndParams } from '../../app';

export class CatalogItems extends Component {
  static readonly ClassNames = {
    container: 'catalog',
    containerTag: 'ul',
    containerClassName: 'catalog-toys',
  };

  static readonly CardStructure = {
    cardTag: 'li',
    cardClassName: 'toy-card',
    cardBemClassName: 'catalog-toys__toy-card',
    favoriteCardClassName: 'toy-card_favorite',
    cardImgPath: './assets/img/toys/',
    cardStar: 'toy-card__favorites__checkbox',
  };

  private itemsList: DataItems;

  private cart: Cart;

  constructor(items: DataItems, cart: Cart) {
    super({ isExist: false, tag: CatalogItems.ClassNames.containerTag });
    this.container?.classList.add(CatalogItems.ClassNames.containerClassName);
    this.itemsList = items;
    this.cart = cart;
  }

  private genList(html: string): void {
    this.itemsList.forEach((item) => {
      const card = <HTMLElement>document.createElement(CatalogItems.CardStructure.cardTag);
      card.classList.add(CatalogItems.CardStructure.cardBemClassName, CatalogItems.CardStructure.cardClassName);
      card.style.backgroundImage = `url("${ChristmasAppPathsAndParams.toysImg}/${item.id}.${ChristmasAppPathsAndParams.toysImgFormat}")`;
      card.dataset.cardId = item.id;
      card.innerHTML = html;
      Object.keys(item).forEach((chunk) => {
        card.innerHTML = card.innerHTML.replace(`***${chunk}***`, `${item[chunk]}`);
      });
      if (this.cart.cart?.has(item.id)) this.changeCatalogItemStatus(card, true);
      this.container?.appendChild(card);
    });
  }

  private changeCatalogItemStatus(item: HTMLElement, activate: boolean): void {
    const star = <HTMLInputElement>item.querySelector('.' + CatalogItems.CardStructure.cardStar);
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
        const size = this.cart.cart?.size;
        if (properCard) {
          const cardId = <string>card.dataset.cardId;
          if (isFavoriteCard) {
            if (size === 0) return;
            this.cart.updateCart(cardId, 'decr');
            this.changeCatalogItemStatus(card, false);
          } else {
            if (size === 20) {
              const message = new Message();
              message.genMessage('overflow');
              message.addTopLevelMessage();
              return;
            }
            this.cart.updateCart(cardId, 'incr');
            this.changeCatalogItemStatus(card, true);
          }
        }
      },
      true
    );
  }

  getContent(data?: DataItems): HTMLElement | null {
    if (!this.container) return null;
    this.container.innerHTML = '';
    if (data) {
      this.itemsList = data;
    }
    this.genList(cardHtml);
    this.addSavingDevice(
      this.container,
      CatalogItems.CardStructure.cardClassName,
      CatalogItems.CardStructure.favoriteCardClassName
    );
    return this.container;
  }
}
