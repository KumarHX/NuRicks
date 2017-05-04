// Angular imports
import { HttpModule } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import {
    Routes,
    RouterModule,
    Router,
    CanActivate
} from '@angular/router';

// Custom Imports
import { MainPipe } from './custom/custom.component';
import { AdminGuard } from './adminlogin/adminlogin.component';
import { AdminService } from './adminpanel/adminpanel.component';
import { NavComponent } from './nav/nav.component';
import { UserComponent } from './user/user.component';
import { MainComponent } from './main/main.component';
import { MarkdownModule } from 'angular2-markdown';
import { BackendService } from './backend/backend.service';
import { OutletComponent } from './main.component';
import { MusicianComponent } from './musician/musician.component';
import { PersistentService } from './main.global.ts';
import { EventViewerService } from './musician/musician.component';
import { AdminLoginComponent } from './adminlogin/adminlogin.component';
import { AdminPanelComponent } from './adminpanel/adminpanel.component';
import { PublicMusicianService } from './publicmusician/publicmusician.component';
import { PublicMusicianComponent } from './publicmusician/publicmusician.component';

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

@Injectable()
class UserGuard implements CanActivate {
    constructor(
    private ps: PersistentService,
    private router: Router
    ) {}

    canActivate() {
        if (this.ps.userObject.fbid != '') {
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
    { path: "adminpanel", component: AdminPanelComponent, canActivate: [ AdminGuard ] },
    { path: "user", component: UserComponent, canActivate: [ UserGuard ] }
];

@NgModule({
    imports: [
        RouterModule,
        HttpModule,
        FormsModule,
        BrowserModule,
        MainPipe,
        RouterModule.forRoot(appRoutes),
        MarkdownModule.forRoot()
    ],
    declarations: [
        OutletComponent,
        NavComponent,
        MainComponent,
        MusicianComponent,
        PublicMusicianComponent,
        AdminLoginComponent,
        AdminPanelComponent,
        UserComponent
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
        AdminService,
        AdminGuard,
        UserGuard
    ]
})
export class MainModule{}
