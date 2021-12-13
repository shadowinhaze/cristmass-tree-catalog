import html from './header.html';
import './header.scss';
import { BtnsCollection, Button } from '../button/button';

export class Header {
  static readonly ClassNames: { [prop: string]: string } = {
    container: 'app-header',
    mobileMenu: 'app-header__hideble-items',
    mobileMenuHiddenMod: 'app-header__hideble-items_hidden',
    mobileMenuActivator: 'app-logo',
    mobileMenuActiveMod: 'app-logo_active',
    navigation: 'app-header__nav',
  };

  static readonly navInfo = {
    parent: 'ul',
    parentClassName: 'page-nav__items',
    childContainer: 'li',
    childContainerClassName: 'page-nav__item',
    child: 'button',
    childClassName: 'page-nav__item__button',
    activeChildClassName: 'page-nav__item__button_active',
  };

  private container: HTMLElement | null;

  private buttons: Button;

  constructor() {
    this.container = document.querySelector(`.${Header.ClassNames.container}`);
    this.buttons = new Button();
  }

  genNav(navCollection: BtnsCollection): void {
    const place = this.container?.querySelector(`.${Header.ClassNames.navigation}`);
    place?.append(this.buttons.genNavBtns(navCollection, Header.navInfo));
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
