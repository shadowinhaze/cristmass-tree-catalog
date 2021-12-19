import './main.scss';
import { Component } from '../../templates/component';

export class Main extends Component {
  static readonly ClassNames = {
    container: 'app-main',
  };

  constructor() {
    super({ isExist: true, className: Main.ClassNames.container });
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

  updateContent(placeClassName: string, data: HTMLElement | null): void {
    const placeNode = this.container?.querySelector('.' + placeClassName);
    if (placeNode) {
      placeNode.innerHTML = '';
      if (!data) return;
      placeNode.append(data);
    }
  }
}
