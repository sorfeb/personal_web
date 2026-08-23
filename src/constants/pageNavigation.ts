/**
 * Input-router scope shared by everything inside a PageLayout dialog.
 *
 * PageLayout owns the directional half (spatial navigation plus `back`), but a
 * page can own more of its own navigation: the About page maps LB and RB to its
 * tab bar. Those are contributions to one scope rather than a second scope
 * pushed on top, because the stack has no fall-through and a nested scope would
 * swallow the spatial navigation underneath it.
 *
 * Contribute from a component that renders PageLayout, not from one rendered
 * inside it. React commits child effects first, and registerScope reads its
 * per-scope config from whichever contributor arrives first.
 */
export const PAGE_SCOPE_ID = 'page';
