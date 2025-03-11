// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { KanbanComponent } from './kanban/kanban.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
//import { BsDropdownModule } from 'ng-bootstrap/dropdown';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        KanbanComponent,
        FilterPipe,
        
       
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule, 
        RouterModule,
        AppRoutingModule ,
        //BsDropdownModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }