export abstract class Component {
  static readonly ClassNames: { [prop: string]: string };

  protected container: HTMLElement | null;

  constructor(is: boolean, cont?: string) {
    this.container = is ? document.querySelector('.' + cont) : document.createElement('div');
  }

  protected parseFromTemplate(html: string): void {
    if (this.container) {
      if (this.container.innerText === '') {
        this.container.innerHTML = html;
      }
    }
  }

  public abstract show(data?: Array<object>): void;
}
