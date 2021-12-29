export abstract class Component {
  static readonly ClassNames: { [prop: string]: string };

  protected container: HTMLElement | HTMLInputElement | null;

  constructor(data: { isExist: boolean; className?: string; tag?: string }) {
    if (data.isExist) {
      this.container = document.querySelector('.' + data.className);
    } else {
      this.container = document.createElement(<string>data.tag);
      if (data.className) {
        this.container.classList.add(data.className);
      }
    }
  }

  protected parseFromTemplate(html: string): void {
    if (this.container) {
      if (this.container.innerText === '') {
        this.container.innerHTML = html;
      }
    }
  }

  getContent(): HTMLElement | HTMLInputElement | null {
    return this.container;
  }
}
