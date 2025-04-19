import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from './route-animations';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [fader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected prepareRoute(outlet: RouterOutlet): boolean {
    return outlet?.isActivated
      ? outlet.activatedRouteData?.['animation'] || outlet.activatedRoute?.routeConfig?.path
      : '';
  }
}
