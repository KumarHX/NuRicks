// Angular imports
import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router, CanActivate } from '@angular/router';
import { HttpModule } from "@angular/http";

// Custom Imports
import { OutletComponent } from './main.component';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main/main.component';
import { MusicianComponent } from './musician/musician.component';
import { EventViewerService } from './musician/musician.component';
import { PublicMusicianComponent } from './publicmusician/publicmusician.component';
import { BackendService } from './backend/backend.service';
import { PersistentService } from './main.global.ts';
import { PublicMusicianService } from './publicmusician/publicmusician.component';

@Injectable()
class MusicianGuard implements CanActivate {
    constructor(
    private ps: PersistentService,
    private router: Router
    ) {}

    canActivate() {
        if (this.ps.musicianObject.fbid != '') {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}

const appRoutes: Routes = [
    { path: "", component: MainComponent, resolve: { pers: PersistentService } },
    { path: "dashboard", component: MusicianComponent, canActivate: [ MusicianGuard ] },
    { path: "musician/:id", component: PublicMusicianComponent, resolve: { pers: PersistentService, mus: PublicMusicianService } }
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
        NavComponent,
        MainComponent,
        MusicianComponent,
        PublicMusicianComponent
    ],
    bootstrap: [
        NavComponent,
        OutletComponent
    ],
    providers: [
        BackendService,
        PersistentService,
        MusicianGuard,
        PublicMusicianService,
        EventViewerService
    ]
})
export class MainModule{}
