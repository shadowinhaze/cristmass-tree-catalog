import html from './footer.html';
import './footer.scss';

export class Footer {
  static readonly ClassNames: { [prop: string]: string } = {
    container: 'app-footer',
  };

  private container: HTMLElement | null;

  constructor() {
    this.container = document.querySelector(`.${Footer.ClassNames.container}`);
  }

  private render(): void {
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  show(): void {
    this.render();
  }
}
