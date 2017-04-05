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

@Injectable()
export class PublicMusicianService {
    p_musicianObject: any = {
        stageName: "",
        firstName: "",
        lastName: "",
        soundcloudLink: "",
        bio: "",
        instagramLink: "",
        youtubeLink: "",
        facebookLink: "",
        picture_url: "",
        verified: false
    }

    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.backendService.getMusician(route.params["id"])
        .map((response: any) => {
            if (response.status == "1" && response.musician_info) {
                const a = response.musician_info;
                this.p_musicianObject.stageName = a.stageName;
                this.p_musicianObject.firstName = a.firstName;
                this.p_musicianObject.lastName = a.lastName;
                this.p_musicianObject.soundcloudLink = a.soundcloudLink;
                this.p_musicianObject.bio = a.bio;
                this.p_musicianObject.instagramLink = a.instagramLink;
                this.p_musicianObject.youtubeLink = a.youtubeLink;
                this.p_musicianObject.facebookLink = a.facebookLink;
                this.p_musicianObject.picture_url = a.picture_url;
                this.p_musicianObject.verified = a.verified;
            } else {
                this.router.navigate(['/']);
            }
        });
    }
}

@Component({
    selector: "publicmusician",
    templateUrl: "publicmusician.component.html"
})
export class PublicMusicianComponent {
    bioFallback: string = "This musician doesn't have a bio";
    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private pm: PublicMusicianService
    ) {

    }
}
