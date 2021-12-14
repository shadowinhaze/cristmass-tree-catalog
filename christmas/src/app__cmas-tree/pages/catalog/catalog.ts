import './catalog.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';

export class Catalog extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  static navInfo = [
    {
      name: PageIdsRU.main,
      link: PageIds.main,
      current: false,
    },
    {
      name: PageIdsRU.catalog,
      link: PageIds.catalog,
      current: true,
    },
    {
      name: PageIdsRU.showroom,
      link: PageIds.showroom,
      current: false,
    },
  ];

  renderPage() {
    this.header.show(Catalog.navInfo);
    this.footer.show();
  }
}
