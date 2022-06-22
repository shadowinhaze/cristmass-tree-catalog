import { Header } from '../../components/header/header';
import { Main } from '../../components/main/main';
import { Button } from '../../components/button/button';
import { Footer } from '../../components/footer/footer';
import { Message } from '../../components/message/message';

export abstract class Page {
  static readonly ClassNames: { [prop: string]: string };

  constructor(
    protected header = new Header(),
    protected main = new Main(),
    protected footer = new Footer(),
    protected buttons = new Button(),
    protected message = new Message(),
  ) {}

  abstract renderPage(): void;
}
