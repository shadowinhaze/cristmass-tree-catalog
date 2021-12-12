import './home.scss';
import html from './home.html';
import { Button } from '../../components/button/button';
import { Footer } from '../../components/footer/footer';
import { PageIds, PageIdsRU } from '../../app';

export class HomePage {
  static readonly ClassNames: { [prop: string]: string } = {
    main: 'app-main',
    mainHomeTheme: 'app-main_home-theme',
  };

  private buttons: Button;

  private footer: Footer;

  private main: HTMLElement | null;

  constructor() {
    this.buttons = new Button();
    this.footer = new Footer();
    this.main = document.querySelector(`.${HomePage.ClassNames.main}`);
  }

  private genMain() {
    if (this.main) {
      this.main.classList.add(HomePage.ClassNames.mainHomeTheme);
      this.main.innerHTML = html;
    }
  }

  generate(): void {
    this.footer.show();
    this.genMain();
    this.buttons.render(this.main, 'buttons-container_home-theme', [
      { name: PageIdsRU.catalog, link: `'#${PageIds.catalog}'` },
      { name: PageIdsRU.showroom, link: `'#${PageIds.showroom}'` },
    ]);
  }
}
