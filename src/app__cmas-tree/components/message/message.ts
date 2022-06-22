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
    nothing:
      'We are very sorry, but with such requests our elves helpers do not find anything...',
    nothingHeader: 'Emptiness...',
    overflow:
      'You will not be able to carry so many toys from the warehouse, 20 types will be enough for you...',
    overflowHeader: 'The cart is full!',
  };

  constructor() {
    super({
      isExist: false,
      className: Message.ClassNames.container,
      tag: Message.ClassNames.containerTag,
    });
  }

  private cleanMessage(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  genMessage(mode: string): void {
    this.cleanMessage();
    this.parseFromTemplate(html);

    const messageHeader = <HTMLElement>(
      this.container?.querySelector('.' + Message.ClassNames.messageHeader)
    );
    const messageText = <HTMLElement>(
      this.container?.querySelector('.' + Message.ClassNames.messageText)
    );

    if (messageHeader) {
      messageHeader.innerText = this.messages[`${mode}Header`];
    }

    if (messageText) {
      messageText.innerText = this.messages[mode];
    }
  }

  getImprignentMessage(): HTMLElement {
    const messageBody = <HTMLElement>(
      this.container?.querySelector('.' + Message.ClassNames.messageBody)
    );
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
