type DataItems = Array<{
  [prop: string]: string | boolean;
  id: string;
  favorite: boolean;
}>;

class DataGrabber {
  data: DataItems = [];

  private async fetchData(path: string): Promise<void> {
    const response = await fetch(path);
    this.data = await response.json();
  }

  async getData(path: string): Promise<DataItems> {
    await this.fetchData(path);
    return this.data;
  }
}

export { DataItems, DataGrabber };
