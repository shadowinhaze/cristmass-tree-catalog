import './showroom-checkpoint.scss';
import { Component } from '../../templates/component';
import { Config, ShowRoomSettings } from '../showroom-settings/showroom-settings';
import { ShowRoomDisplay } from '../../components/showroom-display/showroom-display';
import { ShowRoomKit } from '../showroom-kit/showroom-kit';
import html2canvas from 'html2canvas';

interface CheckPointData {
  settings: Config;
  kit: string;
  toys: string;
  screenshot: CanvasImageData;
}

export class ShowRoomCheckpoint extends Component {
  static readonly ClassNames = {
    container: 'showroom__checkpoint',
    containerTag: 'div',
  };

  private settings = new ShowRoomSettings();

  private checkpoints: Set<string> | undefined;

  private activeCheckpoint: string | undefined;

  constructor() {
    super({ isExist: false, tag: ShowRoomCheckpoint.ClassNames.containerTag });
    this.container?.classList.add(ShowRoomCheckpoint.ClassNames.container);
    this.getFromLocalStorage();
  }

  private genHeader(): void {
    const header = document.createElement('h3');
    header.classList.add('showroom__checkpoint__header');
    header.innerText = 'Сохранения';
    this.container?.prepend(header);
  }

  private addSaveAction(target: HTMLButtonElement): void {
    target.addEventListener('click', async () => {
      const display = <HTMLElement>document.querySelector('.showroom__display');
      const settings = { settings: this.settings.getState() };
      const kit = { kit: <string>document.querySelector('.showroom__kit__items')?.innerHTML };
      const toys = { toys: <string>document.querySelector('.showroom__display__toys-container')?.innerHTML };
      const screenshot = await html2canvas(display);
      const checkpoint = <CheckPointData>(<unknown>{
        screenshot: JSON.stringify(screenshot.toDataURL()),
        ...kit,
        ...toys,
        ...settings,
      });
      this.checkpoints?.add(JSON.stringify(checkpoint));
      this.addItemsToSaveList();
      this.saveToLocalStorage();
    });
  }

  private addResetAction(target: HTMLButtonElement): void {
    target.addEventListener('click', async () => {
      ShowRoomDisplay.removeAllToys();
    });
  }

  private addSaveButton(): void {
    const button = document.createElement('button');
    button.classList.add('default-button', 'showroom__checkpoint__save-button');
    button.innerText = 'Сохранить работу';
    this.addSaveAction(button);
    this.container?.append(button);
  }

  private addResetButton(): void {
    const button = document.createElement('button');
    button.classList.add('default-button', 'showroom__checkpoint__reset-button');
    button.innerText = 'Снять все игрушки';
    this.addResetAction(button);
    this.container?.append(button);
  }

  private cleanItemsList(className: string): void {
    const allBrothers = document.querySelectorAll('.' + className);
    allBrothers?.forEach((brother) => {
      brother.classList.remove(`${className}_active`);
    });
  }

  private addSaveList(): void {
    const list = document.createElement('ul');
    list.classList.add('showroom__checkpoint__save-list');
    list.addEventListener('click', (e) => {
      const target = <HTMLElement>e.target;
      if (target.classList.contains('showroom__checkpoint__save-list__item')) {
        this.activeCheckpoint = target.dataset.checkpointState;
        this.cleanItemsList('showroom__checkpoint__save-list__item');
        target.classList.add('showroom__checkpoint__save-list__item_active');
        this.loadCheckpoint();
      }
    });
    this.container?.append(list);
  }

  private saveToLocalStorage() {
    if (this.checkpoints) {
      localStorage.checkpoints = JSON.stringify([...this.checkpoints]);
    }
  }

  private getFromLocalStorage(): void {
    this.checkpoints = localStorage.checkpoints ? new Set(JSON.parse(localStorage.checkpoints)) : new Set();
  }

  private addItemsToSaveList(): void {
    if (!this.checkpoints) return;
    if (this.checkpoints.size > 0) {
      const list = <HTMLUListElement>this.container?.querySelector('.showroom__checkpoint__save-list');
      if (!list) return;
      list.innerHTML = '';
      [...this.checkpoints].forEach((item, index) => {
        const data = JSON.parse(item);
        const checkpoint = document.createElement('li');
        checkpoint.classList.add('showroom__checkpoint__save-list__item');
        checkpoint.style.backgroundImage = `url("${JSON.parse(data.screenshot)}")`;
        checkpoint.dataset.checkpointState = `${index++}`;
        checkpoint.title = `Загрузить сохранение ${index++}`;
        list?.append(checkpoint);
      });
    }
  }

  private loadCheckpoint() {
    if (!this.checkpoints) return;
    const pull = [...this.checkpoints];
    if (!this.activeCheckpoint) return;
    const state = JSON.parse(pull[+this.activeCheckpoint]);
    this.settings.changeConfig(<Config>state.settings);
    this.settings.virtualStart();

    ShowRoomDisplay.updateToysContainer(<string>state.toys);
    ShowRoomKit.updateKitContainer(<string>state.kit);
  }

  getContent(): HTMLElement {
    this.genHeader();
    this.addResetButton();
    this.addSaveButton();
    this.addSaveList();
    this.addItemsToSaveList();
    return <HTMLElement>this.container;
  }
}
