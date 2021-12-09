export class MainPage {
  constructor(id: string) {
    document.body.innerHTML = id;
  }

  render() {
    console.log('privet');
  }
}
