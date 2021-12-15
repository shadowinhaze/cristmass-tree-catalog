import './catalog.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';
import { CatalogItem } from '../../components/catalog-item/catalog-item';

export class Catalog extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  private CatalogPath = '../../../assets/data/cm-toys.json';

  private CatalogItem: CatalogItem = new CatalogItem(this.CatalogPath);

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

  private customizeMain(): void {
    const content = this.CatalogItem.getContent();
    this.main.addContent(content);
  }

  renderPage() {
    this.header.show(Catalog.navInfo);
    this.customizeMain();
    this.footer.show();
  }
}
