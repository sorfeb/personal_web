interface JQuery {
    ripples(options?: {
      resolution?: number;
      dropRadius?: number;
      perturbance?: number;
    }): JQuery;
    ripples(action: 'drop', x: number, y: number, radius: number, strength: number): JQuery;
    ripples(action: 'destroy'): JQuery;
  }