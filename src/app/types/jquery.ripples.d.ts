interface JQuery {
    ripples(options?: {
      resolution?: number;
      dropRadius?: number;
      perturbance?: number;
    }): JQuery;
    ripples(action: string): JQuery;
  }