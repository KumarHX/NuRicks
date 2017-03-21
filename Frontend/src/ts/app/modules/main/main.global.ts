import { Injectable } from "@angular/core";

import { BackendService } from "./backend/backend.service";

interface userValidation {
    email: string;
    fbid: string;
    stageName: string;
    firstName: string;
    lastName: string;
    soundcloudLink: string;
    bio: string;
    instagramLink: string;
    youtubeLink: string;
    facebookLink: string;
    picture_url: string;
    verified: boolean;
}



// keep user logged in
@Injectable()
export class PersistentService {
    userObject: userValidation = {
        email: "",
        fbid: "",
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
    private backendService: BackendService
    ){
        this.backendService.checkAuth()
        .subscribe((response: any) => {
            if (response.status == "1") {
                const a = response.musician_info;
                this.userObject.email = a.email;
                this.userObject.fbid = a.fbid;
                this.userObject.stageName = a.stageName;
                this.userObject.firstName = a.firstName;
                this.userObject.lastName = a.lastName;
                this.userObject.soundcloudLink = a.soundcloudLink;
                this.userObject.bio = a.bio;
                this.userObject.instagramLink = a.instagramLink;
                this.userObject.youtubeLink = a.youtubeLink;
                this.userObject.facebookLink = a.facebookLink;
                this.userObject.picture_url = a.picture_url;
                this.userObject.verified = a.verified;
            }
        });
    }
}
