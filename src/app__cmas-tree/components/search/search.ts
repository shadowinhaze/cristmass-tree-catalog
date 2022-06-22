import './search.scss';
import { Component } from '../../templates/component';

export class Search extends Component {
  static readonly ClassNames = {
    container: 'search__input__line',
  };

  constructor() {
    super({ isExist: true, className: Search.ClassNames.container });
  }
}
