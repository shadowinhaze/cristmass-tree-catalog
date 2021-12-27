import './showroom-checkpoint.scss';
import { Component } from '../../templates/component';
import { Config, ShowRoomSettings } from '../showroom-settings/showroom-settings';

interface CheckPointData {
  settings: Config;
  kit: HTMLUListElement;
  toys: HTMLElement;
}

export class ShowRoomCheckpoint extends Component {
  static readonly ClassNames = {
    container: 'showroom__checkpoint',
    containerTag: 'div',
  };

  private settings = new ShowRoomSettings();

  private checkpoints: Set<string> | undefined;

  constructor() {
    super({ isExist: false, tag: ShowRoomCheckpoint.ClassNames.containerTag });
    this.container?.classList.add(ShowRoomCheckpoint.ClassNames.container);
    this.getFromLocalStorage();
  }

  private addSaveAction(target: HTMLButtonElement): void {
    target.addEventListener('click', () => {
      const settings = { settings: this.settings.getState() };
      const kit = { kit: <HTMLUListElement>document.querySelector('.showroom__kit__items') };
      const toys = { toys: <HTMLElement>document.querySelector('.showroom__display__toys-container') };
      const checkpoint = {
        ...settings,
        ...kit,
        ...toys,
      };
      this.checkpoints?.add(JSON.stringify(checkpoint));
      console.log(this.checkpoints);
      this.saveToLocalStorage();
    });
  }

  private addSaveButton(): void {
    const button = document.createElement('button');
    button.classList.add('default-button', 'showroom__checkpoint__save-button');
    button.innerText = 'Сохранить работу';
    this.addSaveAction(button);
    this.container?.append(button);
  }

  private addSaveList(): void {
    const list = document.createElement('ul');
    list.classList.add('showroom__checkpoint__save-list');
    this.container?.append(list);
  }

  private saveToLocalStorage() {
    localStorage.checkpoints = JSON.stringify(this.checkpoints);
  }

  private getFromLocalStorage(): void {
    this.checkpoints = localStorage.checkpoints ? JSON.parse(localStorage.checkpoints) : new Set();
  }

  // private addItemsToSaveList(): void {
  // }

  getContent(): HTMLElement {
    this.addSaveButton();
    this.addSaveList();
    return <HTMLElement>this.container;
  }
}
