// Angular imports
import { Component, Injectable } from "@angular/core";
import
{
    Router,
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from "rxjs/Rx";

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Component({
    selector: "publicmusician",
    templateUrl: "publicmusician.component.html"
})
export class PublicMusicianComponent {
    bioFallback: string = "This musician doesn't have a bio";
    constructor(
    private backendService: BackendService,
    private ps: PersistentService
    ) {

    }
}

@Injectable()
export class PublicMusicianService {
    constructor(
    private backendService: BackendService,
    private ps: PersistentService
    ) {

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.backendService.getMusician(route.params["id"])
        .map((response: any) => {
            console.log(response);
        });
    }
}
