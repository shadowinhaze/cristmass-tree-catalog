import './catalog.scss';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
// import { PageIds, PageIdsRU } from '../../app';

export class Catalog {
  static readonly ClassNames: { [prop: string]: string } = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  private header: Header;

  private footer: Footer;

  // private main: HTMLElement | null;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    // this.main = document.querySelector(`.${Catalog.ClassNames.main}`);
  }

  // private genMain() {
  //   if (this.main) {
  //     this.main.classList.add(HomePage.ClassNames.mainHomeTheme);
  //     this.main.innerHTML = html;
  //   }
  // }

  generate(): void {
    this.header.show();
    this.footer.show();
  }
}
