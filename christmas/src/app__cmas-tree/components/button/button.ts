import './button.scss';

type BtnsCollection = Array<{
  name: string;
  link: string;
}>;

export class Button {
  static readonly ClassNames: { [prop: string]: string } = {
    container: 'buttons-container',
    button: 'buttons-container__button',
  };

  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add(Button.ClassNames.container);
  }

  private gen(arr: BtnsCollection): void {
    arr.forEach((item) => {
      const button = document.createElement('button');
      button.classList.add(Button.ClassNames.button);
      button.innerText = item.name;
      button.title = item.name;
      button.dataset.toLocal = item.link;
      this.container.appendChild(button);
    });
  }

  private addLocator(): void {
    const goTo = function (this: HTMLElement, event: Event): void {
      const target = <HTMLElement>event.target;
      if (target.classList.contains(Button.ClassNames.button)) {
        location.hash = `#${target.dataset.toLocal}` || '';
        location.reload();
      }
    };

    this.container.addEventListener('click', goTo);
  }

  render(targetParent: HTMLElement | null, modificator: string | null, btns: BtnsCollection): void {
    this.gen(btns);
    if (modificator) {
      this.container.classList.add(modificator);
    }
    this.addLocator();
    targetParent?.appendChild(this.container);
  }
}
