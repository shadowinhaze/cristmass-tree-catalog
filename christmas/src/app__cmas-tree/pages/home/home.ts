import './home.scss';
import html from './home.html';
import { Page } from '../../templates/page';
import { PageIds, PageIdsRU } from '../../app';

export class HomePage extends Page {
  static readonly ClassNames = {
    main: 'app-main',
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

  private genMain(): void {
    const main = <HTMLElement>document.querySelector(`.${HomePage.ClassNames.main}`);
    if (main) {
      main.classList.add(HomePage.ClassNames.mainHomeTheme);
      main.innerHTML = html;
      this.buttons.renderDefBtns(main, HomePage.ClassNames.mainModificator, { buttons: HomePage.homeButtons });
    }
  }

  renderPage() {
    this.footer.show();
    this.genMain();
  }
}
