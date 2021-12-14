import { Header } from '../../components/header/header';
import { Button } from '../../components/button/button';
import { Footer } from '../../components/footer/footer';

export abstract class Page {
  static readonly ClassNames: { [prop: string]: string };

  protected header: Header;

  protected footer: Footer;

  protected buttons: Button;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.buttons = new Button();
  }

  abstract renderPage(): void;
}
