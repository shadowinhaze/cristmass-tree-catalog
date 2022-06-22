import './catalog.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsEng, ChristmasAppPathsAndParams } from '../../app';
import {
  DataGrabber,
  DataItems,
} from '../../components/data-grabber/data-grabber';
import { Cart } from '../../components/cart/cart';
import { CatalogItems } from '../../components/catalog-items/catalog-item';
import { Filter } from '../../components/filter/filter';

export class Catalog extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_catalog-theme',
  };

  private cart: Cart | undefined;

  private filter: Filter | undefined;

  private catalogItems: CatalogItems | undefined;

  static navInfo = [
    {
      name: PageIdsEng.main,
      link: PageIds.main,
      current: false,
    },
    {
      name: PageIdsEng.catalog,
      link: PageIds.catalog,
      current: true,
    },
    {
      name: PageIdsEng.showroom,
      link: PageIds.showroom,
      current: false,
    },
  ];

  private async setDefaultComponents(): Promise<void> {
    const dataGrabber = new DataGrabber();
    const defaultData = await dataGrabber.getData(
      <string>ChristmasAppPathsAndParams.catalogData,
    );
    this.cart = new Cart(defaultData);
    this.filter = new Filter(defaultData);
    this.catalogItems = new CatalogItems(defaultData, this.cart);
  }

  private getMain(): void {
    const filtersContent = <HTMLElement>this.filter?.getContent();
    const cat = <HTMLElement>this.catalogItems?.getContent();

    const catContainer = <HTMLElement>document.createElement('section');
    catContainer.classList.add('catalog-showcase');
    if (cat) {
      catContainer.appendChild(cat);
    }

    this.main.customize('app-main_catalog');
    this.main.addContent(filtersContent);
    this.main.addContent(catContainer);
  }

  async renderPage() {
    this.header.show(Catalog.navInfo, true);
    await this.setDefaultComponents();
    this.getMain();
    this.footer.show();
  }

  async updateCatalog(data: DataItems): Promise<void> {
    await this.setDefaultComponents();
    if (data.length === 0) {
      this.message?.genMessage('nothing');
      const mess = this.message?.getImprignentMessage();
      if (!mess) return;
      this.main.updateContent('catalog-showcase', mess);
      return;
    }
    const updatedCatalogItems = <HTMLElement>(
      this.catalogItems?.getContent(data)
    );
    this.main.updateContent('catalog-showcase', updatedCatalogItems);
  }
}
