import './cart.scss';
import { Component } from '../../templates/component';
import { DataItems } from '../data-grabber/data-grabber';

export class Cart extends Component {
  static readonly ClassNames = {
    container: 'favorites__display',
  };

  cart: Set<string> | undefined;

  private defaultData: DataItems;

  constructor(defaultData: DataItems) {
    super({ isExist: true, className: Cart.ClassNames.container });
    this.defaultData = defaultData;
    this.cart = this.getStartCart();
    this.updateDisplay();
  }

  private parseData(data: DataItems): Set<string> | undefined {
    this.cart = new Set();
    data.forEach((item) => {
      if (item.favorite) {
        this.cart?.add(item.id);
      }
    });
    this.saveCartToLocalStorage();
    return this.cart;
  }

  private getStartCart(): Set<string> | undefined {
    return localStorage.cart
      ? new Set(JSON.parse(localStorage.cart))
      : this.parseData(this.defaultData);
  }

  private saveCartToLocalStorage(): void {
    if (this.cart) {
      localStorage.cart = JSON.stringify([...this.cart]);
    }
  }

  private updateDisplay(): void {
    const newDisplayAmount = `${this.cart?.size} / 20`;
    if (this.container) {
      this.container.innerText = newDisplayAmount;
    }
  }

  updateCart(id: string, mode: string): void {
    const size = <number>this.cart?.size;
    switch (mode) {
      case 'decr':
        if (size < 1) break;
        this.cart?.delete(id);
        break;
      case 'incr':
        if (size === 20) break;
        this.cart?.add(id);
        break;
    }
    this.saveCartToLocalStorage();
    this.updateDisplay();
  }
}
