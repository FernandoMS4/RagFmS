import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Interceptor } from './app.interceptor.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from "ngx-loading";
import { ReactiveFormsModule } from '@angular/forms';

// Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './pages/login/login.component';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function defaultLanguage(): string {
  const language = localStorage.getItem('language');
  if (language == null || language == "pt-BR") {
    localStorage.setItem('language', 'pt-BR')
    return "pt-BR"
  } else {
    return "es-ES"
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxLoadingModule.forRoot({}),
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    PasswordModule,
    TooltipModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule,
    Interceptor,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'pt-BR',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
