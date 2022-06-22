import './button.scss';
import { Component } from '../../templates/component';

type BtnsCollection = Array<{
  name: string;
  link: string;
  current?: boolean;
}>;

type BtnsRequest = {
  buttons: BtnsCollection;
  options?: { [prop: string]: string };
};

class Button extends Component {
  static readonly ClassNames = {
    container: 'buttons-container',
    button: 'buttons-container__button',
  };

  constructor() {
    super({ isExist: false, className: Button.ClassNames.container, tag: 'div' });
  }

  private genDefBtns(data: BtnsRequest): void {
    data.buttons.forEach((btn) => {
      const button = document.createElement('button');
      button.classList.add(Button.ClassNames.button);
      button.innerText = btn.name;
      button.title = btn.name;
      button.dataset.toLocal = btn.link;
      this.container?.appendChild(button);
    });
  }

  private genNavBtns(data: BtnsRequest): HTMLElement {
    const { buttons, options } = data;
    const error = document.createElement('div');
    error.innerText = 'Пункты меню отсутствуют';
    if (!options) return error;
    const parent = document.createElement(options.parent);
    parent.classList.add(options.parentClassName);
    buttons.forEach((item) => {
      const childContainer = document.createElement(options.childContainer);
      const child = document.createElement(options.child);
      childContainer.classList.add(options.childContainerClassName);
      child.classList.add(options.childClassName);
      if (item.current) {
        child.classList.add(options.activeChildClassName);
      }
      child.dataset.toLocal = item.link;
      child.innerText = item.name;
      child.title = item.name;
      childContainer.appendChild(child);
      parent.appendChild(childContainer);
    });
    this.addLocator(parent, options.childClassName, options.activeChildClassName);
    return parent;
  }

  private addLocator(parent: HTMLElement | null, ...args: Array<string>): void {
    const goTo = function (this: HTMLElement, event: Event): void {
      const target = <HTMLElement>event.target;
      if (target.classList.contains(args[1])) return;
      if (target.classList.contains(args[0])) {
        location.hash = `#${target.dataset.toLocal}` || '';
        location.reload();
      }
    };

    parent?.addEventListener('click', goTo);
  }

  renderDefBtns(modificator: string | null, data: BtnsRequest): HTMLElement | null {
    this.genDefBtns(data);
    if (modificator) {
      this.container?.classList.add(modificator);
    }
    this.addLocator(this.container, Button.ClassNames.button);
    return this.container;
  }

  renderNav(data: BtnsRequest): HTMLElement {
    return this.genNavBtns(data);
  }
}

export { BtnsCollection, BtnsRequest, Button };
