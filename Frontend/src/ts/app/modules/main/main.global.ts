import { Injectable } from "@angular/core";

import { BackendService } from "./backend/backend.service";

interface musicianValidation {
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

interface userValidation {
    email: string;
    fbid: string;
    customer_id: string;
    firstName: string;
    lastName: string;
    picture_url: string;
}

// keep user logged in
@Injectable()
export class PersistentService {
    musicianObject: musicianValidation = {
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

    userObject: userValidation = {
        email: "",
        fbid: "",
        customer_id: "",
        firstName: "",
        lastName: "",
        picture_url: ""
    }

    constructor(
    private backendService: BackendService
    ){
        this.backendService.checkAuth()
        .subscribe((response: any) => {
            if (response.status == "1" && response.musician_info) {
                console.log("Musician");
                const a = response.musician_info;
                this.musicianObject.email = a.email;
                this.musicianObject.fbid = a.fbid;
                this.musicianObject.stageName = a.stageName;
                this.musicianObject.firstName = a.firstName;
                this.musicianObject.lastName = a.lastName;
                this.musicianObject.soundcloudLink = a.soundcloudLink;
                this.musicianObject.bio = a.bio;
                this.musicianObject.instagramLink = a.instagramLink;
                this.musicianObject.youtubeLink = a.youtubeLink;
                this.musicianObject.facebookLink = a.facebookLink;
                this.musicianObject.picture_url = a.picture_url;
                this.musicianObject.verified = a.verified;
            }
            if (response.status == "1" && response.user_info) {
                console.log("User");
                const a = response.user_info;
                this.userObject.email = a.email;
                this.userObject.fbid = a.fbid;
                this.userObject.customer_id = a.customer_id;
                this.userObject.firstName = a.firstName;
                this.userObject.lastName = a.lastName;
                this.userObject.picture_url = a.picture_url;
            }
        });
    }
}
