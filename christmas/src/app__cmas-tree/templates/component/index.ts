export abstract class Component {
  static readonly ClassNames: { [prop: string]: string };

  protected container: HTMLElement | null;

  constructor(data: { isExist: boolean; className?: string; tag?: string }) {
    this.container = data.isExist
      ? document.querySelector('.' + data.className)
      : data.tag
      ? document.createElement(data.tag)
      : null;
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
