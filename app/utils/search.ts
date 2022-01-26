export default class Search {
  result: any = null;

  run(node: any, matcher: string): any {
    if (!this.isObject(node)) return null;

    for (const [key, val] of this.getAdjacent(node)) {
      if (key === matcher) {
        this.result = val;
      }

      this.run(val, matcher);
    }

    return this.result;
  };

  private isObject(entity: any): boolean {
    return typeof entity === 'object' && entity !== null;
  }
  private getAdjacent(obj: any) {
    return Object.entries(obj).filter(([, v]: any) => this.isObject(v));
  }
}

