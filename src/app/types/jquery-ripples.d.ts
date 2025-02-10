declare module 'jquery.ripples' {
  interface RipplesOptions {
      resolution?: number;
      dropRadius?: number;
      perturbance?: number;
      interactive?: boolean;
  }

  interface JQuery {
      ripples(options?: RipplesOptions): JQuery;
      ripples(method: 'drop', x: number, y: number, radius: number, strength: number): JQuery;
      ripples(method: 'destroy'): JQuery;
  }

  export default function ripples(options?: RipplesOptions): void;
}
