import './showroom-kit.scss';
import { Component } from '../../templates/component';
import { DataItems } from '../data-grabber/data-grabber';
import { Cart } from '../cart/cart';
import { ChristmasAppPathsAndParams } from '../../app';

export class ShowRoomKit extends Component {
  static readonly ClassNames = {
    container: 'showroom__kit',
    containerTag: 'div',
  };

  private itemsList: DataItems;

  private cart: Cart;

  constructor(items: DataItems, cart: Cart) {
    super({ isExist: false, tag: ShowRoomKit.ClassNames.containerTag });
    this.container?.classList.add(ShowRoomKit.ClassNames.container);
    this.itemsList = items;
    this.cart = cart;
  }

  private genHeader(): void {
    const header = document.createElement('h3');
    header.classList.add('showroom__kit__header');
    header.innerText = 'Избранная коллекция';
    this.container?.prepend(header);
  }

  private genList(): void {
    const kitList = document.createElement('ul');
    kitList.classList.add('showroom__kit__items');
    this.itemsList.forEach((item) => {
      if (this.cart.cart?.has(item.id)) {
        const card = <HTMLLIElement>document.createElement('li');
        card.classList.add('showroom__kit__item');
        card.style.backgroundImage = `url("${ChristmasAppPathsAndParams.toysImg}${item.id}.${ChristmasAppPathsAndParams.toysImgFormat}")`;
        const cardAmount = document.createElement('span');
        cardAmount.classList.add('showroom__kit__item__amount');
        cardAmount.innerText = `${item.count}`;
        card.appendChild(cardAmount);
        kitList.appendChild(card);
      }
    });
    this.container?.append(kitList);
  }

  getContent(): HTMLElement {
    this.genHeader();
    this.genList();
    return <HTMLElement>this.container;
  }
}
