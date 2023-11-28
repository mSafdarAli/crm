import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullWindowComponent } from './full-window/full-window.component';
import { LeftSideBarComponent } from './narrow-window/left-side-bar/left-side-bar.component';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';
import { TopBarComponent } from './narrow-window/top-bar/top-bar.component';
import { NgChartsModule } from 'ng2-charts';

import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormControllerModule } from './shared/form-controller/form-controller.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordPopupComponent } from './narrow-window/change-password-popup/change-password-popup.component';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TokenService } from 'src/_services/token.service';
import { environment } from 'src/environments/environment';
import { customToast } from './customtoast.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { FullLoaderComponent } from './full-loader/full-loader.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};
export function jwtOptionsFactory(tokenService: TokenService) {
  return {
    tokenGetter: () => {
      return tokenService.token;
    },
    whitelistedDomains: environment.whitelistedDomains,
  }
}
@NgModule({
  declarations: [
    AppComponent,
    FullWindowComponent,
    NarrowWindowComponent,
    TopBarComponent,
    LeftSideBarComponent,
    ChangePasswordPopupComponent,
    FullLoaderComponent
    ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ng-universal-demystified'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormControllerModule,
    NgChartsModule,
    MatDialogModule,
    AuthModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService],
      }
    }),
  ],
  entryComponents: [customToast],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }, 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
