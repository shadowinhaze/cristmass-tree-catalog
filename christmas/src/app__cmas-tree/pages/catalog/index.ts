import './catalog.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';
import { DataGrabber } from '../../components/data-grabber/data-grabber';
import { Cart } from '../../components/cart/cart';
import { CatalogItems } from '../../components/catalog-items/catalog-item';

export class Catalog extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  private CatalogPath = '../../../assets/data/cm-toys.json';

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

  private async getMain(): Promise<void> {
    const miner = new DataGrabber();
    const data = miner.getData(this.CatalogPath);
    const cart = new Cart(await data);
    const contMaker = new CatalogItems(await data, cart);
    const content = contMaker.getContent();
    this.main.addContent(content);
  }

  async renderPage() {
    this.header.show(Catalog.navInfo);
    this.getMain();
    this.footer.show();
  }
}
