import './catalog.scss';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { BtnsCollection } from '../../components/button/button';
import { PageIds, PageIdsRU } from '../../app';

const navLinks: BtnsCollection = [
  {
    name: 'дом',
    link: '',
    current: false,
  },
  {
    name: 'каталог',
    link: 'catalog',
    current: true,
  },
  {
    name: 'шоу-рум',
    link: 'showroom',
    current: false,
  },
];

export class Catalog {
  static readonly ClassNames: { [prop: string]: string } = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  private header: Header;

  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.footer = new Footer();
  }

  generate(): void {
    this.header.show();
    this.header.genNav(navLinks);
    this.footer.show();
  }
}
