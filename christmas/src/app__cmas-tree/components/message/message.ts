import './message.scss';
import html from './message.html';
import { Component } from '../../templates/component';

export class Message extends Component {
  static readonly ClassNames = {
    container: 'app-main__message-container',
    containerTag: 'div',
    messageBody: 'app-main__message-body',
    messageHeader: 'app-main__message-body__header',
    messageText: 'app-main__message-body__text',
  };

  private readonly messages: { [prop: string]: string } = {
    nothing: 'Нам очень жаль, но с такими запросами эльфы-помощники не смогли ничего найти...',
    nothingHeader: 'Пустота...',
    overflow: 'Вы не сможете унести со склада столько игрушек, Вам хватит и 20 видов...',
    overflowHeader: 'Корзина переполнена!',
  };

  constructor() {
    super({ isExist: false, tag: Message.ClassNames.containerTag });
    this.container?.classList.add(Message.ClassNames.container);
  }

  private cleanMessage(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  genMessage(mode: string): void {
    this.cleanMessage();
    this.parseFromTemplate(html);

    const messageHeader = <HTMLElement>this.container?.querySelector('.' + Message.ClassNames.messageHeader);
    const messageText = <HTMLElement>this.container?.querySelector('.' + Message.ClassNames.messageText);

    if (messageHeader) {
      messageHeader.innerText = this.messages[`${mode}Header`];
    }

    if (messageText) {
      messageText.innerText = this.messages[mode];
    }
  }

  getImprignentMessage(): HTMLElement {
    const messageBody = <HTMLElement>this.container?.querySelector('.' + Message.ClassNames.messageBody);
    messageBody.classList.add('app-main__message-body_built-in');
    return messageBody;
  }

  addTopLevelMessage(): void {
    const main = document.body.querySelector('main');
    if (this.container) {
      main?.appendChild(this.container);
    }

    setTimeout((): void => {
      if (this.container) {
        main?.removeChild(this.container);
      }
    }, 2800);
  }
}
