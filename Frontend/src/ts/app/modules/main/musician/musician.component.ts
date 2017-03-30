// Angular imports
import { Component } from "@angular/core";

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Component({
    selector: "musician",
    templateUrl: "musician.component.html"
})
export class MusicianComponent {
    bioFallback: string = "Edit your page to add a bio";
    constructor(
    private backendService: BackendService,
    private ps: PersistentService
    ) {
        $(document).ready(function () {
            const $bio = $(".bio");

            $(".fa-edit").click(() => {
                $(".fa-edit").fadeOut(200);
                $(".fa-lock").fadeIn(200);
                $(".fa-camera").fadeIn(250);
                $(".bioLinks").delay(200).fadeOut(200);
                $(".bioEditLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "true");
            });

            $(".fa-lock").click(() => {
                $(".fa-camera").fadeOut(200);
                $(".fa-lock").fadeOut(200);
                $(".fa-edit").fadeIn(250);
                $(".bioEditLinks").delay(200).fadeOut(200);
                $(".bioLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "false");
            });
        });
    }

    editSys(): void {
        $("#instagram-url").val( this.ps.musicianObject.instagramLink);
        $("#facebook-url").val(  this.ps.musicianObject.facebookLink);
        $("#youtube-url").val(   this.ps.musicianObject.youtubeLink);
        $("#soundcloud-url").val(this.ps.musicianObject.soundcloudLink);
        $("#profile-url").val(   this.ps.musicianObject.picture_url);
    }

    saveMusicianData(): void {
        this.ps.musicianObject.instagramLink  = $("#instagram-url").val();
        this.ps.musicianObject.facebookLink   = $("#facebook-url").val();
        this.ps.musicianObject.youtubeLink    = $("#youtube-url").val();
        this.ps.musicianObject.soundcloudLink = $("#soundcloud-url").val();
        this.ps.musicianObject.picture_url    = $("#profile-url").val();
        this.ps.musicianObject.stageName      = $("#stage-name").text();
        this.ps.musicianObject.bio            = $("#bio").text();
        this.backendService.musicianSaveDashboard(this.ps.musicianObject)
        .subscribe((response: any) => {

        });
    }
}
