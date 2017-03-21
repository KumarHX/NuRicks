// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from "@angular/http";

// Custom Imports
import { OutletComponent } from './main.component';
import { MainComponent } from './main/main.component';
import { BackendService } from './backend/backend.service';
import { routing } from './main.routing';

const appRoutes: Routes = [
    { path: "", component: MainComponent }
];

@NgModule({
    imports: [
        RouterModule,
        HttpModule,
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        OutletComponent,
        MainComponent
    ],
    bootstrap: [
        OutletComponent
    ],
    providers: [
        BackendService
    ]
})
export class MainModule{}
