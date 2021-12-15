import html from './header.html';
import './header.scss';
import { Component } from '../../templates/component';
import { BtnsCollection, Button } from '../button/button';

export class Header extends Component {
  static readonly ClassNames = {
    container: 'app-header',
    mobileMenu: 'app-header__hideble-items',
    mobileMenuHiddenMod: 'app-header__hideble-items_hidden',
    mobileMenuActivator: 'app-logo',
    mobileMenuActiveMod: 'app-logo_active',
    navigation: 'app-header__nav',
  };

  static readonly navParams = {
    parent: 'ul',
    parentClassName: 'page-nav__items',
    childContainer: 'li',
    childContainerClassName: 'page-nav__item',
    child: 'button',
    childClassName: 'page-nav__item__button',
    activeChildClassName: 'page-nav__item__button_active',
  };

  private buttons: Button;

  constructor() {
    super({ isExist: true, className: Header.ClassNames.container });
    this.buttons = new Button();
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

  private genNavBtns(btns: BtnsCollection): void {
    const place = this.container?.querySelector(`.${Header.ClassNames.navigation}`);
    const navBtns = this.buttons.renderNav({ buttons: btns, options: Header.navParams });
    place?.appendChild(navBtns);
  }

  show(data: BtnsCollection) {
    this.parseFromTemplate(html);
    this.genNavBtns(data);
    this.activateMobileMenu();
  }
}
