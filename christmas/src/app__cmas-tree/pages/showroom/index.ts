import './showroom.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';
import { DataGrabber } from '../../components/data-grabber/data-grabber';
import { Cart } from '../../components/cart/cart';
import { ShowRoomSettings } from '../../components/showroom-settings/showroom-settings';
import { ShowRoomDisplay } from '../../components/showroom-display/showroom-display';

export class ShowRoom extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_showroom-theme',
  };

  private CatalogPath = './assets/data/cm-toys.json';

  private cart: Cart | undefined;

  private settings = new ShowRoomSettings();

  private display = new ShowRoomDisplay();

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
  }

  private getMain(): void {
    const customizer = <HTMLElement>this.settings?.getContent();
    const display = <HTMLElement>this.display?.getContent();
    this.main.customize('app-main_showroom');
    this.main.addContent(customizer);
    this.main.addContent(display);
  }

  async renderPage() {
    this.header.show(ShowRoom.navInfo, false);
    await this.setDefaultComponents();
    this.getMain();
    this.footer.show();
  }
}
