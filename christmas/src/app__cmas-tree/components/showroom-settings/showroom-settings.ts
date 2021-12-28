import './showroom-settings.scss';
import { Component } from '../../templates/component';
import { ChristmasAppPathsAndParams } from '../../app';
import { ShowRoomDisplay } from '../showroom-display/showroom-display';

type TransObject = { [prop: string]: string | number };
export type Config = { [prop: string]: string | boolean | number };

export class ShowRoomSettings extends Component {
  static readonly ClassNames = {
    container: 'showroom__settings',
    containerTag: 'nav',
    sectionContainer: 'showroom__settings__section',
    lightsActivator: 'showroom__settings__section_lights__activator',
    eq: 'showroom__settings__section__item_eq',
  };

  private static Config: Config = {
    tree: 'tree-1',
    background: 'bg-1',
    light: '',
    lightsON: false,
    lightsFirstLauch: true,
    music: false,
    snow: false,
  };

  private static colorfulLightsOn = false;

  private static Lights: Array<string> = ['colorful', 'red', 'green', 'yellow', 'blue', 'white'];

  private static Equipment: Array<string> = ['music', 'snow'];

  private music: HTMLAudioElement = document.createElement('audio');

  private display = new ShowRoomDisplay();

  constructor() {
    super({ isExist: false, tag: ShowRoomSettings.ClassNames.containerTag });
    this.container?.classList.add(ShowRoomSettings.ClassNames.container);
    this.getDataFromLocalStorage();
  }

  private genSettingsSection(
    isArtistColleciton: boolean,
    modificator: string,
    itemModificator: string,
    sectionHeaderText: string
  ): void {
    const section = document.createElement('section');
    section?.classList.add(
      `${ShowRoomSettings.ClassNames.sectionContainer}`,
      `${ShowRoomSettings.ClassNames.sectionContainer}_${modificator}`
    );
    const sectionHeader = document.createElement('h3');
    const sectionList = document.createElement('ul');

    let sectionItemsCollection: Array<TransObject>;

    if (isArtistColleciton) {
      sectionItemsCollection = this.genItemsCollection(<boolean>true, itemModificator, {
        path: <string>ChristmasAppPathsAndParams[`${itemModificator}Collection`],
        amount: <number>ChristmasAppPathsAndParams[`${itemModificator}CollectionAmount`],
        format: <string>ChristmasAppPathsAndParams[`${itemModificator}CollectionFormat`],
      });
    } else {
      sectionItemsCollection = this.genItemsCollection(isArtistColleciton, itemModificator);
    }

    this.genSettingsSectionItems(sectionList, sectionItemsCollection);
    sectionHeader.classList.add(`${ShowRoomSettings.ClassNames.sectionContainer}__header`);
    sectionList.classList.add(`${ShowRoomSettings.ClassNames.sectionContainer}__items`);

    if (modificator === 'lights') {
      sectionList.classList.add(`${ShowRoomSettings.ClassNames.sectionContainer}__items_${modificator}`);
    }
    sectionHeader.innerText = sectionHeaderText;

    section?.prepend(sectionHeader, sectionList);
    this.container?.appendChild(section);
  }

  private genSettingsSectionItems(parent: HTMLElement, itemsCollection: Array<TransObject>): void {
    itemsCollection.forEach((item) => {
      const itemHTML = document.createElement('li');
      if (item.itemAdditionalModificator) {
        itemHTML.classList.add(
          `${ShowRoomSettings.ClassNames.sectionContainer}__item`,
          `${ShowRoomSettings.ClassNames.sectionContainer}__item_${item.itemModificator}`,
          `${ShowRoomSettings.ClassNames.sectionContainer}__item_${item.itemAdditionalModificator}`
        );
        itemHTML.dataset.itemId = <string>item.id;
      } else {
        itemHTML.classList.add(
          `${ShowRoomSettings.ClassNames.sectionContainer}__item`,
          `${ShowRoomSettings.ClassNames.sectionContainer}__item_${item.itemModificator}`
        );
        itemHTML.style.backgroundImage = `url(${item.imgSrc})`;
        itemHTML.dataset.itemId = <string>item.id;
      }

      parent.append(itemHTML);
    });

    if (itemsCollection[0].itemModificator === 'light') {
      const activator = <HTMLInputElement>document.createElement('input');
      activator.type = 'checkbox';
      activator.classList.add(ShowRoomSettings.ClassNames.lightsActivator);
      parent.appendChild(activator);
    }
  }

  private genItemsCollection(
    modeDefault: boolean,
    itemModificator: string,
    config?: {
      path: string;
      amount: number;
      format: string;
    }
  ): Array<TransObject> {
    const itemsCollection: Array<TransObject> = [];

    const defaultAdding = (): void => {
      if (!config) return;
      for (let i = 1; i < config.amount + 1; i++) {
        const item: TransObject = {
          id: `${itemModificator}-${i}`,
          itemModificator: itemModificator,
          imgSrc: `${config.path}/${i}.${config.format}`,
        };

        itemsCollection.push(item);
      }
    };

    const nonDefaultAdding = (arr: Array<string>): void => {
      arr.forEach((item) => {
        const addible: TransObject = {
          id: `${itemModificator}-${item}`,
          itemModificator: itemModificator,
          itemAdditionalModificator: `${itemModificator}_${item}`,
        };

        itemsCollection.push(addible);
      });
    };

    switch (itemModificator) {
      case 'light':
        nonDefaultAdding(ShowRoomSettings.Lights);
        break;
      case 'eq':
        nonDefaultAdding(ShowRoomSettings.Equipment);
        break;
      default:
        defaultAdding();
        break;
    }

    return itemsCollection;
  }

  private setMusic(): void {
    this.music.innerHTML = `<source src="${ChristmasAppPathsAndParams.audio}" type="audio/mpeg">`;
  }

  private musicControl(): void {
    if (ShowRoomSettings.Config.music) {
      document.body.appendChild(this.music);
      this.music.load();
      this.music.play();
    } else {
      this.music.pause();
      document.body.removeChild(this.music);
    }
  }

  private snowControl(): void {
    if (ShowRoomSettings.Config.snow) {
      this.display.setSnow();
    } else {
      this.display.removeSnow();
    }
  }

  private cleanItemsList(className: string): void {
    const allBrothers = this.container?.querySelectorAll('.' + className);
    allBrothers?.forEach((brother) => {
      brother.classList.remove(`${className}_active`);
    });
  }

  private backgroundControl(): void {
    const bgNumber = (<string>ShowRoomSettings.Config.background).split('-')[1];
    const currentPath = `${ChristmasAppPathsAndParams.bgCollection}/${bgNumber}.jpg`;
    this.display.setBackGround(currentPath);
  }

  private treeControl(): void {
    const treeNumber = (<string>ShowRoomSettings.Config.tree).split('-')[1];
    this.display.setTree(treeNumber);
  }

  private lightControl(): void {
    const lightColor = (<string>ShowRoomSettings.Config.light).split('-')[1];

    if (ShowRoomSettings.Config.lightsFirstLauch || ShowRoomSettings.colorfulLightsOn) {
      ShowRoomSettings.Config.lightsFirstLauch = false;
      ShowRoomSettings.colorfulLightsOn = false;
      this.display.setLights(lightColor);
    }

    if (lightColor === 'colorful') {
      ShowRoomSettings.colorfulLightsOn = true;
      this.display.setLights(lightColor);
    }

    if (ShowRoomSettings.Config.lightsON) {
      this.display.setLightsColor(lightColor);
    }
  }

  private addListener(): void {
    const lightsActivator = <HTMLInputElement>(
      this.container?.querySelector(`.${ShowRoomSettings.ClassNames.lightsActivator}`)
    );

    lightsActivator?.addEventListener('change', () => {
      ShowRoomSettings.Config.lightsON = !ShowRoomSettings.Config.lightsON;
      this.display.turnOffLights();
    });

    this.container?.addEventListener('click', (e) => {
      const target = <HTMLElement>e.target;
      switch (true) {
        case target.classList.contains('showroom__settings__section__item_eq_music'):
          target.classList.toggle('showroom__settings__section__item_eq_active');
          ShowRoomSettings.Config.music = !ShowRoomSettings.Config.music;
          this.musicControl();
          break;
        case target.classList.contains('showroom__settings__section__item_eq_snow'):
          target.classList.toggle('showroom__settings__section__item_eq_active');
          ShowRoomSettings.Config.snow = !ShowRoomSettings.Config.snow;
          this.snowControl();
          break;
        case target.classList.contains('showroom__settings__section__item_bg'):
          this.cleanItemsList('showroom__settings__section__item_bg');
          target.classList.toggle('showroom__settings__section__item_bg_active');
          ShowRoomSettings.Config.background = <string>target.dataset.itemId;
          this.backgroundControl();
          break;
        case target.classList.contains('showroom__settings__section__item_tree'):
          this.cleanItemsList('showroom__settings__section__item_tree');
          target.classList.toggle('showroom__settings__section__item_tree_active');
          ShowRoomSettings.Config.tree = <string>target.dataset.itemId;
          this.treeControl();
          break;
        case target.classList.contains('showroom__settings__section__item_light'):
          if (!ShowRoomSettings.Config.lightsFirstLauch && !ShowRoomSettings.Config.lightsON) break;
          if (!target.classList.contains('showroom__settings__section__item_light_active')) {
            this.cleanItemsList('showroom__settings__section__item_light');
            target.classList.add('showroom__settings__section__item_light_active');
            ShowRoomSettings.Config.light = <string>target.dataset.itemId;

            if (ShowRoomSettings.Config.lightsFirstLauch) {
              ShowRoomSettings.Config.lightsON = !ShowRoomSettings.Config.lightsON;
              lightsActivator.checked = true;
            }
            this.lightControl();
          }

          break;
      }
    });
  }

  private virtualStartLight(): void {
    if (ShowRoomSettings.Config.light) {
      const light = <HTMLLIElement>document.querySelector(`[data-item-id="${ShowRoomSettings.Config.light}"]`);
      const lightsActivator = <HTMLInputElement>(
        document.querySelector(`.${ShowRoomSettings.ClassNames.lightsActivator}`)
      );

      if (ShowRoomSettings.Config.lightsON) {
        const tree = document.querySelector('.showroom__display__tree-container__tree');
        tree?.addEventListener('load', () => {
          light.click();
          const lightColor = (<string>ShowRoomSettings.Config.light).split('-')[1];
          this.display.setLights(lightColor);
          lightsActivator.checked = <boolean>ShowRoomSettings.Config.lightsON;
        });
      }
    }
  }

  private addSaveButton(): void {
    const button = document.createElement('button');
    button.classList.add('default-button', 'showroom__settings__save-button');
    button.innerText = 'Cохранить настройки';
    this.addSaveAction(button);
    this.container?.append(button);
  }

  private addSaveAction(target: HTMLButtonElement): void {
    target.addEventListener('click', () => {
      localStorage.showRoomSettings = JSON.stringify(ShowRoomSettings.Config);
    });
  }

  private getDataFromLocalStorage(): void {
    ShowRoomSettings.Config = localStorage.showRoomSettings
      ? JSON.parse(localStorage.showRoomSettings)
      : ShowRoomSettings.Config;
  }

  private addResetButton(): void {
    const button = document.createElement('button');
    button.classList.add('default-button', 'showroom__settings__reset-button');
    button.innerText = 'Сбросить настройки';
    this.addResetAction(button);
    this.container?.append(button);
  }

  private addResetAction(target: HTMLButtonElement): void {
    target.addEventListener('click', () => {
      localStorage.showRoomSettings = '';
      location.reload();
    });
  }

  virtualStart(): void {
    const activateEq = (eq: string) => {
      const target = <HTMLElement>document.querySelector(`.${ShowRoomSettings.ClassNames.eq}_${eq}`);
      if (ShowRoomSettings.Config[eq]) {
        if (target.classList.contains(`${ShowRoomSettings.ClassNames.eq}_active`)) return;
        ShowRoomSettings.Config[eq] = false;
        target.click();
      }
    };

    const chooseGraphics = (type: string) => {
      const target = <HTMLLIElement>document.querySelector(`[data-item-id="${ShowRoomSettings.Config[type]}"]`);
      target.click();
    };

    ['tree', 'background'].forEach((type) => chooseGraphics(type));
    this.virtualStartLight();
    ShowRoomSettings.Equipment.forEach((eq) => activateEq(eq));
  }

  getState(): Config {
    return ShowRoomSettings.Config;
  }

  changeConfig(obj: Config): void {
    ShowRoomSettings.Config = {
      ...obj,
    };
    console.log(ShowRoomSettings.Config);
  }

  getContent() {
    this.genSettingsSection(false, 'equipments', 'eq', 'Праздничная атмосфера');
    this.genSettingsSection(true, 'models', 'tree', 'Модель');
    this.genSettingsSection(true, 'backgrounds', 'bg', 'Окружение');
    this.genSettingsSection(false, 'lights', 'light', 'Гирлянда');
    this.addSaveButton();
    this.addResetButton();
    this.setMusic();
    this.addListener();
    return this.container;
  }
}
