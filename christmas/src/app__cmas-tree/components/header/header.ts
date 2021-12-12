import html from './header.html';
import './header.scss';

export class Header {
  static readonly ClassNames: { [prop: string]: string } = {
    container: 'app-header',
    mobileMenu: 'app-header__hideble-items',
    mobileMenuHiddenMod: 'app-header__hideble-items_hidden',
    mobileMenuActivator: 'app-logo',
    mobileMenuActiveMod: 'app-logo_active',
  };

  private container: HTMLElement | null;

  constructor() {
    this.container = document.querySelector(`.${Header.ClassNames.container}`);
  }

  private render(): void {
    if (this.container) {
      if (this.container.innerText === '') {
        this.container.innerHTML = html;
      }
    }
  }

  private activateMobileMenu(): void {
    const mobileMenu = this.container?.querySelector(`.${Header.ClassNames.mobileMenu}`);
    const activator = this.container?.querySelector(`.${Header.ClassNames.mobileMenuActivator}`);
    const mobilize = (): void => {
      if (window.screen.width < 900) {
        mobileMenu?.classList.toggle(Header.ClassNames.mobileMenuHiddenMod);
        activator?.classList.toggle(Header.ClassNames.mobileMenuActiveMod);
      }
    };
    activator?.addEventListener('click', mobilize);
  }

  show(): void {
    this.render();
    this.activateMobileMenu();
  }
}
