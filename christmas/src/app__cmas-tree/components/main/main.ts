import './main.scss';
import { Component } from '../../templates/component';

export class Main extends Component {
  static readonly ClassNames = {
    container: 'app-main',
  };

  constructor() {
    super(true, Main.ClassNames.container);
  }

  customize(className: string): void {
    this.container?.classList.add(className);
  }

  addContent(data: string | HTMLElement | null): void {
    if (data && this.container) {
      if (typeof data === 'string') {
        this.container.innerHTML = data;
      } else {
        this.container.append(data);
      }
    }
  }

  show() {}
}
