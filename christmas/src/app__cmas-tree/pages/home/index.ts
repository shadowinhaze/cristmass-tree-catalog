import './home.scss';
import html from './home.html';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';

export class HomePage extends Page {
  static readonly ClassNames = {
    mainHomeTheme: 'app-main_home-theme',
    mainModificator: 'buttons-container_home-theme',
  };

  static homeButtons = [
    {
      name: PageIdsRU.catalog,
      link: PageIds.catalog,
    },
    {
      name: PageIdsRU.showroom,
      link: PageIds.showroom,
    },
  ];

  private customizeMain(): void {
    this.main.customize(HomePage.ClassNames.mainHomeTheme);
    this.main.addContent(html);
    this.main.addContent(
      this.buttons.renderDefBtns(HomePage.ClassNames.mainModificator, { buttons: HomePage.homeButtons })
    );
  }

  renderPage() {
    this.customizeMain();
    this.footer.show();
  }
}
