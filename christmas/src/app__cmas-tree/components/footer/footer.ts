import html from './footer.html';
import './footer.scss';
import { Component } from '../../templates/component';

export class Footer extends Component {
  static readonly ClassNames = {
    container: 'app-footer',
  };

  constructor() {
    super({ isExist: true, className: Footer.ClassNames.container });
  }

  show(): void {
    this.parseFromTemplate(html);
  }
}
