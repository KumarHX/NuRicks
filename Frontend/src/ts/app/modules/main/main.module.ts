// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

// Custom Imports
import { OutletComponent } from './main.component';
import { MainComponent } from './main/main.component';
import { routing } from './main.routing';

const appRoutes: Routes = [
    { path: "", component: MainComponent }
];

@NgModule({
    imports: [
        RouterModule,
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        OutletComponent,
        MainComponent
    ],
    bootstrap: [
        OutletComponent
    ]
})
export class MainModule{}
