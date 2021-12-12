import './app.scss';
import { HomePage } from './pages/home/home';
import { Catalog } from './pages/catalog/catalog';

enum PageIds {
  main = 'main',
  catalog = 'catalog',
  showroom = 'showroom',
}

enum PageIdsRU {
  main = 'домашняя',
  catalog = 'каталог',
  showroom = 'шоу-рум',
}

class ChristmasApp {
  private renderNewPage(pageID: string): void {
    let page: null | HomePage | Catalog = null;
    switch (pageID) {
      case PageIds.main:
        page = new HomePage();
        break;
      case PageIds.catalog:
        page = new Catalog();
        break;
    }
    if (page) {
      page.generate();
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
