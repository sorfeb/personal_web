declare module 'jquery.ripples' {
  interface RipplesOptions {
      resolution?: number;
      dropRadius?: number;
      perturbance?: number;
      interactive?: boolean;
  }

  interface JQuery {
      ripples(options?: any): JQuery;
      ripples(method: 'drop', x: number, y: number, radius: number, strength: number): JQuery;
      ripples(method: 'destroy'): JQuery;
  }

  export {};
}
