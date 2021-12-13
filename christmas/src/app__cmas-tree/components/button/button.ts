import './button.scss';

type BtnsCollection = Array<{
  name: string;
  link: string;
  current?: boolean;
}>;

class Button {
  static readonly ClassNames: { [prop: string]: string } = {
    container: 'buttons-container',
    button: 'buttons-container__button',
  };

  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add(Button.ClassNames.container);
  }

  private genDefBtns(arr: BtnsCollection): void {
    arr.forEach((item) => {
      const button = document.createElement('button');
      button.classList.add(Button.ClassNames.button);
      button.innerText = item.name;
      button.title = item.name;
      button.dataset.toLocal = item.link;
      this.container.appendChild(button);
    });
  }

  private addLocator(parent: HTMLElement, ...args: Array<string>): void {
    const goTo = function (this: HTMLElement, event: Event): void {
      const target = <HTMLElement>event.target;
      if (target.classList.contains(args[1])) return;
      if (target.classList.contains(args[0])) {
        location.hash = `#${target.dataset.toLocal}` || '';
        location.reload();
      }
    };

    parent.addEventListener('click', goTo);
  }

  genNavBtns(arr: BtnsCollection, info: { [prop: string]: string }): HTMLElement {
    const parent = document.createElement(info.parent);
    parent.classList.add(info.parentClassName);
    arr.forEach((item) => {
      const childContainer = document.createElement(info.childContainer);
      const child = document.createElement(info.child);
      childContainer.classList.add(info.childContainerClassName);
      child.classList.add(info.childClassName);
      if (item.current) {
        child.classList.add(info.activeChildClassName);
      }
      child.dataset.toLocal = item.link;
      child.innerText = item.name;
      child.title = item.name;
      childContainer.appendChild(child);
      parent.appendChild(childContainer);
    });
    this.addLocator(parent, info.childClassName, info.activeChildClassName);
    return parent;
  }

  render(targetParent: HTMLElement | null, modificator: string | null, btns: BtnsCollection): void {
    this.genDefBtns(btns);
    if (modificator) {
      this.container.classList.add(modificator);
    }
    this.addLocator(this.container, Button.ClassNames.button);
    targetParent?.appendChild(this.container);
  }
}

export { BtnsCollection, Button };
