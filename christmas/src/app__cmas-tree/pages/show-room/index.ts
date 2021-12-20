import './show-room.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';
import { DataGrabber } from '../../components/data-grabber/data-grabber';
import { Cart } from '../../components/cart/cart';

import { Message } from '../../components/message/message';

export class ShowRoom extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_show-room-theme',
  };

  private CatalogPath = './assets/data/cm-toys.json';

  private cart: Cart | undefined;

  private message: Message | undefined;

  static navInfo = [
    {
      name: PageIdsRU.main,
      link: PageIds.main,
      current: false,
    },
    {
      name: PageIdsRU.catalog,
      link: PageIds.catalog,
      current: false,
    },
    {
      name: PageIdsRU.showroom,
      link: PageIds.showroom,
      current: true,
    },
  ];

  private async setDefaultComponents(): Promise<void> {
    const dataGrabber = new DataGrabber();
    const defaultData = await dataGrabber.getData(this.CatalogPath);
    this.cart = new Cart(defaultData);
    this.message = new Message();
  }

  private getMain(): void {
    const works = document.createElement('h2');
    works.innerText = 'Страница находится в разработке';

    this.main.customize('app-main_show-room');
    this.main.addContent(works);
  }

  async renderPage() {
    this.header.show(ShowRoom.navInfo);
    await this.setDefaultComponents();
    this.getMain();
    this.footer.show();
  }
}
