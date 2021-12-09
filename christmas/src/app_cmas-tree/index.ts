import { MainPage } from './pages/main';

export enum PageIds {
  main = 'main',
}

export default class App {
  private renderNewPage(pageID: string): void {
    let page: null | MainPage = null;
    switch (pageID) {
      case PageIds.main:
        page = new MainPage(pageID);
        break;
    }
    if (page) {
      page.render();
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
