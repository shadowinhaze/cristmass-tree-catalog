import './app.scss';
import { HomePage } from './pages/home';
import { Catalog } from './pages/catalog';
import { ShowRoom } from './pages/show-room';

const enum PageIds {
  main = 'main',
  catalog = 'catalog',
  showroom = 'showroom',
}

const enum PageIdsRU {
  main = 'дом',
  catalog = 'каталог',
  showroom = 'шоу-рум',
}

class ChristmasApp {
  private renderNewPage(pageID: string): void {
    let page: null | HomePage | Catalog | ShowRoom = null;
    switch (pageID) {
      case PageIds.main:
        page = new HomePage();
        break;
      case PageIds.catalog:
        page = new Catalog();
        break;
      case PageIds.showroom:
        page = new ShowRoom();
        break;
    }
    if (page) {
      page.renderPage();
    }
  }

  private enableRouter(): void {
    const hash: string = window.location.hash.slice(1);

    if (hash !== '') {
      this.renderNewPage(hash);
    } else {
      this.renderNewPage(PageIds.main);
    }

    window.addEventListener('hashchange', (): void => {
      const newHash = window.location.hash.slice(1);
      this.renderNewPage(newHash);
    });
  }

  init() {
    this.enableRouter();
  }
}

export { PageIds, PageIdsRU, ChristmasApp };
