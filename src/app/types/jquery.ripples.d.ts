import * as $ from 'jquery';

declare module 'jquery.ripples' {
  interface RipplesOptions {
      resolution?: number;
      dropRadius?: number;
      perturbance?: number;
  }
  interface JQuery {
      ripples(options?: RipplesOptions): this;
      ripples(method: 'drop', x: number, y: number, radius: number, strength: number): this;
      ripples(method: 'destroy'): this;
  }
}
