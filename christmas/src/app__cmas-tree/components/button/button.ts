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
      button.addEventListener('click', () => {
        location.hash = item.link;
      });
      this.container.appendChild(button);
    });
  }

  render(targetParent: HTMLElement | null, modificator: string | null, btns: BtnsCollection): void {
    this.gen(btns);
    if (modificator) {
      this.container.classList.add(modificator);
    }
    targetParent?.appendChild(this.container);
  }
}
