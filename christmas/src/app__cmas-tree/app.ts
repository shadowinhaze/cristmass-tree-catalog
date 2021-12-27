import './app.scss';
import { HomePage } from './pages/home';
import { Catalog } from './pages/catalog';
import { ShowRoom } from './pages/showroom';

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

const ChristmasAppPathsAndParams: { [prop: string]: string | number } = {
  catalogData: './assets/data/cm-toys.json',
  audio: './assets/audio/audio.mp3',
  toysImg: './assets/img/toys',
  toysImgFormat: 'png',
  treeCollection: './assets/img/trees',
  treeCollectionAmount: 6,
  treeCollectionFormat: 'png',
  bgCollection: './assets/img/backgrounds',
  bgCollectionAmount: 10,
  bgCollectionFormat: 'jpg',
};

class ChristmasApp {
  private renderNewPage(pageID: string): void {
    let page = undefined;

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

export { PageIds, PageIdsRU, ChristmasAppPathsAndParams, ChristmasApp };
