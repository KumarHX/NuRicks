// Angular imports
import { Component, Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

export class AdminService {
    musicians: any = [];
    events: any = [];
}

@Component({
    selector: "adminpanel",
    templateUrl: "adminpanel.component.html"
})
export class AdminPanelComponent implements OnInit {
    private musicianView: any = {
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
        verified: false,
    };

    constructor(
    private ps: PersistentService,
    private backendService: BackendService,
    private as: AdminService
    ){
        $(document).ready(function() {
            $('.adminTabs').children().click(function (e: any) {
                var toShow = "." + $(e.currentTarget).attr('data-show');
                $('.adminTabs').children().removeClass('active');
                $(e.currentTarget).addClass('active');
                $('.adminPanel > div,form').hide(150);
                $(toShow).delay(150).show();
            });
            $('.artistBlock .exit').click(function() {
                $(this).parent().fadeOut(150);
            });
            $('#createShow').click(function() {
                $('.createShow').show();
            });
        });
    }

    ngOnInit() {
        this.backendService.getAllMusicians()
        .subscribe((response) => {
            if (response.status == "1") {
                this.as.musicians = response.musicians;
            }
        });
        this.backendService.getAllEvents()
        .subscribe((response) => {
            if (response.status == "1") {
                this.as.events = response.events;
            }
        });
    }

    getMusician(idex: number): void {
        this.musicianView = this.as.musicians[idex];
        $('.artistBlock').fadeIn(150);
    }

    addShow(form: any): void {
        form.zip_code = parseInt(form.zip_code);
        form.cost = parseInt(form.cost);
        form.extraAtDoor = parseInt(form.extraAtDoor);
        form.numberNeededToSell = parseInt(form.numberNeededToSell);
        form.isPossibleEvent = form.isPossibleEvent == "" ? false : true;
        this.backendService.createEvent(form)
        .subscribe((response: any) => {
            if (response.status == "1") {

            }
        });
    }
}
