import './showroom-display.scss';
import { Component } from '../../templates/component';
import { ShowRoomKit } from '../showroom-kit/showroom-kit';
import { SvgMaps } from './svg-maps';
import { ChristmasAppPathsAndParams } from '../../app';

interface Client extends DragEvent {
  layerX: number;
  layerY: number;
}

export class ShowRoomDisplay extends Component {
  static readonly ClassNames = {
    container: 'showroom__display',
    containerTag: 'div',
    treeContainer: 'showroom__display__tree-container',
    snowContainer: 'showroom__display__snow-container',
    lightsContainer: 'showroom__display__lights-container',
    toysContainer: 'showroom__display__toys-container',
    treeMap: 'showroom__display__toys-container__map',
    tree: 'showroom__display__tree-container__tree',
    snowFlake: 'showroom__display__snow-container__snowflake',
    lightsRope: 'showroom__display__lights-container__rope',
    light: 'showroom__display__lights-container__light',
  };

  private snow: HTMLElement | undefined;

  private lights: HTMLElement | undefined;

  constructor() {
    super({
      isExist: false,
      className: ShowRoomDisplay.ClassNames.container,
      tag: ShowRoomDisplay.ClassNames.containerTag,
    });
  }

  setBackGround(bgPath: string): void {
    const display = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.container);
    if (display) {
      display.style.backgroundImage = `url(${bgPath})`;
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

  setTree(treeNumber: string): void {
    const tree = <HTMLImageElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.tree);
    const treeMap = <SVGElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.treeMap);
    if (tree) {
      tree.src = `${ChristmasAppPathsAndParams.treeCollection}/${treeNumber}.${ChristmasAppPathsAndParams.treeCollectionFormat}`;
    }
    if (treeMap) {
      treeMap.innerHTML = SvgMaps[+treeNumber - 1];
    }
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
    this.lights = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.lightsContainer);
    if (this.lights) {
      this.lights.classList.toggle(`${ShowRoomDisplay.ClassNames.lightsContainer}_off`);
    }
  }

  private relocate(ev: Client): void {
    const toysContainer = document.querySelector('.' + ShowRoomDisplay.ClassNames.toysContainer);
    const movingChild = <HTMLElement>(
      toysContainer?.querySelector(`[data-item-id="${ev.dataTransfer?.getData('toy')}"]`)
    );
    const offsetX = <string>ev.dataTransfer?.getData('offsetX');
    const offsetY = <string>ev.dataTransfer?.getData('offsetY');
    if (movingChild) {
      movingChild.style.left = `${ev.layerX - +offsetX / 2}px`;
      movingChild.style.top = `${ev.layerY - +offsetY / 2}px`;
    }
  }

  private cloneToy(ev: Client): void {
    const toysContainer = document.querySelector('.' + ShowRoomDisplay.ClassNames.toysContainer);
    const offsetX = <string>ev.dataTransfer?.getData('offsetX');
    const offsetY = <string>ev.dataTransfer?.getData('offsetY');
    const toyClone = document.createElement('div');

    toyClone.classList.add('showroom__display__toys-container__toy');
    toyClone.style.backgroundImage = `url("${ev.dataTransfer?.getData('img')}")`;
    toyClone.dataset.itemId = ev.dataTransfer?.getData('toy');
    toyClone.style.left = `${ev.layerX - +offsetX / 2}px`;
    toyClone.style.top = `${ev.layerY - +offsetY / 2}px`;
    toyClone.draggable = true;

    ShowRoomKit.badgeUpdater(<string>ev.dataTransfer?.getData('toy'), 'decr');
    if (toysContainer) {
      toysContainer.appendChild(toyClone);
    }
  }

  private removeToy(parent: HTMLElement): void {
    const toy = <HTMLElement>parent.querySelector('.showroom__display__toys-container__toy_grabbing');
    if (toy) {
      parent?.removeChild(toy);
      ShowRoomKit.badgeUpdater(<string>toy.dataset.itemId, 'incr');
    }
  }

  static removeAllToys(): void {
    const parent = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.toysContainer);
    const toys = <Array<HTMLElement>>(<unknown>parent.querySelectorAll('.showroom__display__toys-container__toy'));
    toys.forEach((toy) => {
      parent.removeChild(toy);
      ShowRoomKit.badgeUpdater(<string>toy.dataset.itemId, 'incr');
    });
  }

  private addToysContainer(): void {
    const treeContainer = <HTMLElement>this.container?.querySelector('.' + ShowRoomDisplay.ClassNames.treeContainer);

    const toysContainer = <HTMLElement>document.createElement('div');
    toysContainer.classList.add(ShowRoomDisplay.ClassNames.toysContainer);

    this.addDragListener(toysContainer);

    treeContainer?.appendChild(toysContainer);
  }

  private addMapArea(): void {
    setTimeout(() => {
      const tree = <HTMLImageElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.tree);
      const toysContainer = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.toysContainer);
      const width = tree.clientWidth;
      const height = tree.clientHeight;

      const area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      area.classList.add(ShowRoomDisplay.ClassNames.treeMap);
      area.setAttribute('width', `${width}`);
      area.setAttribute('height', `${height}`);
      area.setAttribute('opacity', '0');

      // area.innerHTML = `<polygon points="${width / 2},0,0,${height},${width},${height}" />`;
      area.innerHTML = SvgMaps[0];

      toysContainer.append(area);
    }, 1000);
  }

  private addDragListener(elParent: HTMLElement): void {
    elParent.addEventListener('dragstart', (e): void => {
      const target = <HTMLElement>e.target;
      if (target.classList.contains('showroom__display__toys-container__toy')) {
        if (e.dataTransfer) {
          e.dataTransfer.clearData();
          e.dataTransfer.setData('offsetX', `${e.offsetX}`);
          e.dataTransfer.setData('offsetY', `${e.offsetY}`);
          e.dataTransfer.setData('toy', `${target.dataset.itemId}`);
          e.dataTransfer.setData('mode', 'relocate');
          e.dataTransfer.effectAllowed = 'move';
          target.classList.toggle('showroom__display__toys-container__toy_grabbing');
        }
      }
    });

    elParent.addEventListener('dragend', (e): void => {
      const target = <HTMLElement>e.target;
      if (target.classList.contains('showroom__display__toys-container__toy')) {
        target.classList.toggle('showroom__display__toys-container__toy_grabbing');
      }
    });

    elParent.addEventListener('dragover', (e): void => {
      e.preventDefault();
    });

    elParent.addEventListener('drop', (e): void => {
      e.preventDefault();
      const target = <SVGPolygonElement>e.target;
      if (target.tagName === 'path') {
        const dropAreaMemberMode = e.dataTransfer?.getData('mode');
        if (dropAreaMemberMode === 'fromCollection') {
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
            this.cloneToy(<Client>e);
          }
        } else if (dropAreaMemberMode === 'relocate') {
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
            this.relocate(<Client>e);
          }
        }
      }
    });

    elParent.addEventListener('dragleave', (e): void => {
      e.preventDefault();
      const target = <SVGPolygonElement>e.target;
      if (target.tagName === 'path') {
        this.removeToy(elParent);
      }
    });
  }

  static updateToysContainer(oldContainer: string): void {
    const toysContainer = <HTMLElement>document.querySelector('.' + ShowRoomDisplay.ClassNames.toysContainer);
    if (toysContainer) {
      toysContainer.innerHTML = oldContainer;
    }
  }

  getContent(): HTMLElement {
    this.setStartTree();
    this.addToysContainer();
    this.addMapArea();
    return <HTMLElement>this.container;
  }
}
