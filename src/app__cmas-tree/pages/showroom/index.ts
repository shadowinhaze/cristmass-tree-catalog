import './showroom.scss';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU, ChristmasAppPathsAndParams } from '../../app';
import { DataGrabber } from '../../components/data-grabber/data-grabber';
import { Cart } from '../../components/cart/cart';
import { ShowRoomSettings } from '../../components/showroom-settings/showroom-settings';
import { ShowRoomDisplay } from '../../components/showroom-display/showroom-display';
import { ShowRoomKit } from '../../components/showroom-kit/showroom-kit';
import { ShowRoomCheckpoint } from '../../components/showroom-checkpoint/showroom-checkpoint';

export class ShowRoom extends Page {
  static readonly ClassNames = {
    main: 'app-main',
    mainHomeTheme: 'app-main_showroom-theme',
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
      current: false,
    },
    {
      name: PageIdsRU.showroom,
      link: PageIds.showroom,
      current: true,
    },
  ];

  private cart: Cart | undefined;

  private settings = new ShowRoomSettings();

  private display = new ShowRoomDisplay();

  private kit: ShowRoomKit | undefined;

  private checkpoint = new ShowRoomCheckpoint();

  private async setDefaultComponents(): Promise<void> {
    const dataGrabber = new DataGrabber();
    const defaultData = await dataGrabber.getData(
      <string>ChristmasAppPathsAndParams.catalogData,
    );
    this.cart = new Cart(defaultData);
    this.kit = new ShowRoomKit(defaultData, this.cart);
  }

  private getMain(): void {
    const customizer = <HTMLElement>this.settings?.getContent();
    const display = <HTMLElement>this.display?.getContent();
    const kit = <HTMLElement>this.kit?.getContent();
    const checkpoint = <HTMLElement>this.checkpoint?.getContent();

    this.main.customize('app-main_showroom');
    this.main.addContent(customizer);
    this.main.addContent(display);
    this.main.addContent(kit);
    this.main.addContent(checkpoint);
  }

  async renderPage() {
    this.header.show(ShowRoom.navInfo, false);
    await this.setDefaultComponents();
    this.getMain();
    this.settings.virtualStart();
    this.footer.show();
  }
}
