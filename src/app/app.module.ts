import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule} from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import { ClickOutsideModule} from 'ng-click-outside';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { OxfordService } from './oxford.service';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './details/details.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    DetailsComponent,
    ErrorpageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(
      [
        {path:'home',component : HomeComponent},
        {path:'',component : HomeComponent},
        {path:'details/:word_id',component : DetailsComponent},
        {path:'**',component : ErrorpageComponent}
      ]
    )
  ],
  providers: [OxfordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
