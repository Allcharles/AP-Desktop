import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { MaterialModule } from './modules/material.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AnalysisTypeComponent } from './components/analysis-type/analysis-type.component';
import { AnalysisAudioComponent } from './components/analysis-audio/analysis-audio.component';
import { AnalysisOutputComponent } from './components/analysis-output/analysis-output.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    NavBarComponent,
    AnalysisTypeComponent,
    AnalysisAudioComponent,
    AnalysisOutputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule {}
