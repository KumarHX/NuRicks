// Angular imports
import { Component, Injectable } from "@angular/core";
import
{
    Router,
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivate
} from '@angular/router';
import { Observable } from "rxjs/Rx";
import { NgForm } from '@angular/forms';

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
    private ps: PersistentService,
    private router: Router,
    private backendService: BackendService
    ) {}

    canActivate(): Observable<boolean> {
        return this.backendService.adminLogin(this.ps.adminObject.u, this.ps.adminObject.p)
        .map((response) => {
            console.log(response);
            if (response.status == "1") {
                return true;
            }
            this.router.navigate(['/adminlogin']);
            return false;
        });
    }
}

@Component({
    selector: "adminlogin",
    templateUrl: "adminlogin.component.html"
})
export class AdminLoginComponent {
    constructor(
    private ps: PersistentService,
    private router: Router,
    private backendService: BackendService
    ){

    }

    preLogin(value: any): void {
        this.ps.adminObject.u = value.adminusername;
        this.ps.adminObject.p = value.adminpassword;
        this.router.navigate(['adminpanel']);
    }
}
