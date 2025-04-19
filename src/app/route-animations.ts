import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const fader = trigger('fader', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
      })
    ], { optional: true }),

    group([
      query(':leave', [
        animate('300ms 100ms ease', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('300ms 100ms ease', style({ opacity: 1 }))
      ], { optional: true })
    ]),
  ])
]);
