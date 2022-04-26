import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { environment } from '@env/environment';
// import { UntilDestroy, untilDestroyed } from '@shared';
import { I18nService } from '@app/i18n';
import { AuthenticationService, CredentialsService } from './auth';
import { UsersWeb } from './models/UsersWeb';

// const log = new Logger('App');

// @UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser!: UsersWeb;

  version: string | null = environment.version;
  shopName: string | undefined;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      // Logger.enableProductionMode();
    }

    // log.debug('init');
    this.logout_in_trigger();

    // Setup translations
    //this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    //const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    // merge(this.translateService.onLangChange, onNavigationEnd)
    //   .pipe(
    //     map(() => {
    //       let route = this.activatedRoute;
    //       while (route.firstChild) {
    //         route = route.firstChild;
    //       }
    //       return route;
    //     }),
    //     filter((route) => route.outlet === 'primary'),
    //     switchMap((route) => route.data),
    //     untilDestroyed(this)
    //   )
    //   .subscribe((event) => {
    //     const title = event.title;
    //     if (title) {
    //       this.titleService.setTitle(this.translateService.instant(title));
    //     }
    //   });
  }

  logout_in_trigger() {
    //https://stackoverflow.com/questions/40145002/how-to-access-a-method-from-app-component-from-other-component
    //Assuming your class AppCompenent is saved as app.component.ts Then in your BuyTestComponent class, you need to first import it AppComponent like below

    var self = this;
    //$(".fix-header .topbar").trigger("sticky_kit:detach");

    this.currentUser = this.credentialsService.credentials as UsersWeb;
    console.log(this.currentUser);

    if (this.currentUser && this.currentUser.usersShop && this.currentUser.usersShop.length > 0) {
      this.shopName = this.currentUser.usersShop[0].ShopName;
    }
    // this.load_company();
    //$("#sidebarnav").metisMenu();
    // Observable.timer(1).subscribe(()=>
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
    this.logout_in_trigger();
  }

  ngOnDestroy() {
    //this.i18nService.destroy();
  }
}
