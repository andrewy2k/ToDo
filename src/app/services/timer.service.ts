import { Injectable } from '@angular/core';
import { interval, map, Observable, shareReplay, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  public readonly now$: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => new Date()),
    shareReplay(1),
  );
}
