// Angular imports
import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router, CanActivate } from '@angular/router';
import { HttpModule } from "@angular/http";
import { FormsModule } from '@angular/forms';

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
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { AdminGuard } from './adminlogin/adminlogin.component';
import { AdminPanelComponent } from './adminpanel/adminpanel.component';

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
    { path: "musician/:id", component: PublicMusicianComponent, resolve: { pers: PersistentService, mus: PublicMusicianService } },
    { path: "adminlogin", component: AdminLoginComponent },
    { path: "adminpanel", component: AdminPanelComponent, canActivate: [ AdminGuard ] }
];

@NgModule({
    imports: [
        RouterModule,
        HttpModule,
        FormsModule,
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        OutletComponent,
        NavComponent,
        MainComponent,
        MusicianComponent,
        PublicMusicianComponent,
        AdminLoginComponent,
        AdminPanelComponent
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
        EventViewerService,
        AdminGuard
    ]
})
export class MainModule{}
