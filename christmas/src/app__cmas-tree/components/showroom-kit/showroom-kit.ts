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

  private addDragListener(elParent: HTMLElement) {
    elParent.addEventListener('dragstart', (e): void => {
      const target = <HTMLImageElement>e.target;
      if (target.classList.contains('showroom__kit__item__img')) {
        if (e.dataTransfer) {
          e.dataTransfer.setData('offsetX', `${e.offsetX}`);
          e.dataTransfer.setData('offsetY', `${e.offsetY}`);
          e.dataTransfer.setData('itemID', `${target.dataset.itemId}-${Date.now()}`);
          e.dataTransfer.setData('img', <string>target.src);
          e.dataTransfer.setData('mode', 'fromCollection');
          e.dataTransfer.effectAllowed = 'copy';
        }
      }
    });
  }

  static badgeUpdater(id: string, mode: string): void {
    const dockId = id.split('-')[0];
    const dockAmount = <HTMLSpanElement>document.querySelector(`[data-dock-id="${dockId}"] span`);

    if (dockAmount) {
      const currentAmount = +dockAmount.innerText;
      if (mode === 'decr') {
        if (currentAmount - 1 < 0) return;
        if (currentAmount - 1 === 0) {
          if (dockAmount.parentElement) {
            dockAmount.parentElement.classList.toggle('showroom__kit__item_out');
          }
        }
        dockAmount.innerText = `${+currentAmount - 1}`;
      } else if (mode === 'incr') {
        if (currentAmount + 1 === 1) {
          if (dockAmount.parentElement) {
            dockAmount.parentElement.classList.remove('showroom__kit__item_out');
          }
        }
        dockAmount.innerText = `${+currentAmount + 1}`;
      }
    }
  }

  private genList(): void {
    const kitList = document.createElement('ul');
    kitList.classList.add('showroom__kit__items');
    this.itemsList.forEach((item) => {
      if (this.cart.cart?.has(item.id)) {
        const card = <HTMLLIElement>document.createElement('li');
        card.classList.add('showroom__kit__item');
        card.dataset.dockId = item.id;

        const img = document.createElement('img');
        img.src = `${ChristmasAppPathsAndParams.toysImg}/${item.id}.${ChristmasAppPathsAndParams.toysImgFormat}`;
        img.classList.add('showroom__kit__item__img');
        img.dataset.itemId = item.id;
        img.draggable = true;

        const cardAmount = document.createElement('span');
        cardAmount.classList.add('showroom__kit__item__amount');
        cardAmount.innerText = `${item.count}`;

        card.appendChild(cardAmount);
        card.appendChild(img);
        kitList.appendChild(card);
      }
    });
    this.addDragListener(kitList);
    this.container?.append(kitList);
  }

  getContent(): HTMLElement {
    this.genHeader();
    this.genList();
    return <HTMLElement>this.container;
  }
}
