import './showroom-display.scss';
import { Component } from '../../templates/component';

export class ShowRoomDisplay extends Component {
  static readonly ClassNames = {
    container: 'showroom__display',
    containerTag: 'div',
    treeContainer: 'showroom__display__tree-container',
    snowContainer: 'showroom__display__snow-container',
    lightsContainer: 'showroom__display__lights-container',
    tree: 'showroom__display__tree-container__tree',
    snowFlake: 'showroom__display__snow-container__snowflake',
    lightsRope: 'showroom__display__lights-container__rope',
    light: 'showroom__display__lights-container__light',
  };

  private snow: HTMLElement | undefined;

  private lights: HTMLElement | undefined;

  constructor() {
    super({ isExist: false, tag: ShowRoomDisplay.ClassNames.containerTag });
    this.container?.classList.add(ShowRoomDisplay.ClassNames.container);
  }

  setBackGround(bgPath: string): void {
    const display = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.container);
    if (display) {
      display.style.backgroundImage = `url(${bgPath})`;
    }
  }

  setTree(treePath: string): void {
    const tree = <HTMLImageElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.tree);
    if (tree) {
      tree.src = treePath;
    }
  }

  private setStartTree(): void {
    const treeContainer = document.createElement('div');
    const tree = document.createElement('img');
    treeContainer.classList.add(ShowRoomDisplay.ClassNames.treeContainer);
    tree.classList.add(ShowRoomDisplay.ClassNames.tree);
    treeContainer.append(tree);
    this.container?.append(treeContainer);
  }

  setSnow(): void {
    const display = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.container);
    this.snow = document.createElement('div');
    this.snow.classList.add(ShowRoomDisplay.ClassNames.snowContainer);
    for (let i = 0; i < 51; i++) {
      const snowFlake = document.createElement('span');
      snowFlake.classList.add(ShowRoomDisplay.ClassNames.snowFlake);
      this.snow.append(snowFlake);
    }
    display.appendChild(this.snow);
  }

  removeSnow(): void {
    const display = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.container);
    if (this.snow) {
      display.removeChild(this.snow);
    }
  }

  setLightsColor(lightColor: string): void {
    const rootStyles = document.documentElement;
    rootStyles.style.setProperty('--light-color', `var(--${lightColor})`);
  }

  setLights(lightColor: string): void {
    const treeContainer = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.treeContainer);
    this.setLightsColor(lightColor);

    const lightsContainer = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.lightsContainer);
    this.lights = lightsContainer || document.createElement('div');
    this.lights.innerHTML = '';
    this.lights.classList.add(ShowRoomDisplay.ClassNames.lightsContainer);
    console.log(this.lights);
    const ropeHeight = treeContainer.clientHeight / 7;

    const genLight = (num: number): DocumentFragment => {
      const list = document.createDocumentFragment();
      for (let i = 0; i < Math.round(num * 1.5); i++) {
        const light = document.createElement('li');
        if (lightColor === 'colorful') {
          light.classList.add(ShowRoomDisplay.ClassNames.light, `${ShowRoomDisplay.ClassNames.light}_colorful`);
        } else {
          light.classList.add(ShowRoomDisplay.ClassNames.light);
        }
        light.classList.add(ShowRoomDisplay.ClassNames.light);
        light.style.transform = `translateY(${Math.random() > 0.5 ? '-' : '+'}${Math.random() * 30}px)`;
        list.appendChild(light);
      }
      return list;
    };

    const genRope = (num: number): void => {
      const lightsRope = document.createElement('ul');
      lightsRope.classList.add(ShowRoomDisplay.ClassNames.lightsRope);
      lightsRope.style.height = `${ropeHeight}px`;
      lightsRope.style.width = `${100 * num * 0.1}%`;
      lightsRope.appendChild(genLight(num));
      this.lights?.appendChild(lightsRope);
    };

    for (let i = 1; i < 8; i++) {
      genRope(i);
    }

    treeContainer.appendChild(this.lights);
  }

  turnOffLights(): void {
    if (this.lights) {
      this.lights.classList.toggle(`${ShowRoomDisplay.ClassNames.lightsContainer}_off`);
    }
  }

  getContent(): HTMLElement {
    this.setStartTree();
    return <HTMLElement>this.container;
  }
}
