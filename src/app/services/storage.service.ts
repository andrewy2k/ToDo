import { inject, Injectable } from '@angular/core';
import { JSONSchema, StorageMap } from '@ngx-pwa/local-storage';
import { delay, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: StorageMap = inject(StorageMap);

  public get<T>(key: string, schema: JSONSchema): Observable<T | undefined> {
    return of(null).pipe(
      delay(400),
      switchMap(() => this.storage.get<T>(key, schema)),
    );
  }

  public set<T>(key: string, value: T): Observable<undefined> {
    return of(null).pipe(
      delay(400),
      switchMap(() => this.storage.set(key, value))
    );
  }

  public delete(key: string): Observable<undefined> {
    return of(null).pipe(
      delay(400),
      switchMap(() => this.storage.delete(key))
    );
  }
}
