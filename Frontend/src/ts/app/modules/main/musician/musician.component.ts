// Angular imports
import {
    Component,
    Injectable,
    OnInit,
    AfterViewChecked,
} from "@angular/core";

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
declare var SC: any;

export class EventViewerService {
    event: any = {
        eventName: "",
        doorsOpen: "",
        ShowStarts: "",
        image_url: "",
        eventDate: "",
        street_name: "",
        zip_code: 0,
        city: "",
        state: "",
        ageRequirement: "",
        cost: 0
    }
}

@Component({
    selector: "musician",
    templateUrl: "musician.component.html"
})
export class MusicianComponent implements OnInit, AfterViewChecked {
    bioFallback: string = "Edit your page to add a bio";
    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private evs: EventViewerService
    ) {
        $(document).ready(function () {
            const $bio = $(".bio");

            /* Profile info save
             */
            $(".edit").click(() => {
                $(".edit").fadeOut(200);
                $(".submit").fadeIn(200);
                $(".uploadBanner").fadeIn(250);
                $(".bioLinks").delay(200).fadeOut(200);
                $(".bioEditLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "true");
            });

            $(".submit").click(() => {
                $(".uploadBanner").fadeOut(200);
                $(".submit").fadeOut(200);
                $(".edit").fadeIn(250);
                $(".bioEditLinks").delay(200).fadeOut(200);
                $(".bioLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "false");
            });

            /* Available/My Show logic
             */
            $('.showTabs').children('span').click((e: any) => {
                const that = $(e.currentTarget);
                if (!$(that).hasClass('activeTab')) {
                    $(that).toggleClass('activeTab');
                    $(that).siblings().toggleClass('activeTab');
                }
            });

            $('.myShows').click((e: any) => {
                if ($(e.currentTarget).hasClass('activeTab')) {
                    $('.availableShowsList').fadeOut(150);
                    $('.myShowsList').delay(150).fadeIn(150);
                }
            });

            $('.availableShows').click((e: any) => {
                if ($(e.currentTarget).hasClass('activeTab')) {
                    $('.myShowsList').fadeOut(150);
                    $('.availableShowsList').delay(150).fadeIn(150);
                }
            });
        });
    }

    ngOnInit() {
        this.backendService.getPossibleEvents()
        .subscribe((response: any) => {
            if (response.status == "1") {
                this.ps.musicianObject.possibleEvents = response.events;
                this.backendService.getMusicianTickets(this.ps.musicianObject.fbid)
                .subscribe((response: any) => {
                    if (response.status == "1") {
                        const tickets = response.tickets;
                        for (var i = 0; i < tickets.length; ++i) {
                            const numberSold = tickets[i].numberSold;
                            this.backendService.getEventInfoFromID(tickets[i].EventId)
                            .subscribe((response) => {
                                response.event_info._ticketsSold = numberSold;
                                this.ps.musicianObject.events.push(response.event_info);
                                // remove from possible events
                                const pred = (x: any) => {
                                    return x.id;
                                }
                                const remIndex = this.ps.musicianObject.possibleEvents.map(pred).indexOf(response.event_info.id);
                                this.ps.musicianObject.possibleEvents.splice(remIndex, 1);
                            });
                        }
                    }
                });
            }
        });
    }

    ngAfterViewChecked() {
        /* Join show modal
         */
        const $joinModal = $('.joinShowModal');
        $('.availableShowsList').find('.btn').click((e: any) => {
            $joinModal.fadeIn(250);
        });

        $joinModal.find('.exit').click((e: any) => {
            $(e.currentTarget).parent().fadeOut(250);
        });
    }

    viewShow(event: any): void {
        const index = $(event.currentTarget).parent().parent().index();
        this.evs.event = this.ps.musicianObject.possibleEvents[index];
    }

    submitCreateTicket(): void {
        this.backendService.createTicket(<string>this.ps.musicianObject.fbid, <number>this.evs.event.id)
        .subscribe((response) => {
            if (response.status == "1") {
                window.location.href = '/';
            }
        });
    }

    editSys(): void {
        $("#instagram-url") .val(this.ps.musicianObject.instagramLink);
        $("#facebook-url")  .val(this.ps.musicianObject.facebookLink);
        $("#youtube-url")   .val(this.ps.musicianObject.youtubeLink);
        $("#soundcloud-url").val(this.ps.musicianObject.soundcloudLink);
        $("#profile-url")   .val(this.ps.musicianObject.picture_url);
    }

    saveMusicianData(): void {
        this.ps.musicianObject.instagramLink  = $("#instagram-url").val();
        this.ps.musicianObject.facebookLink   = $("#facebook-url").val();
        this.ps.musicianObject.youtubeLink    = $("#youtube-url").val();
        this.ps.musicianObject.soundcloudLink = $("#soundcloud-url").val();
        this.ps.musicianObject.picture_url    = $("#profile-url").val();
        this.ps.musicianObject.email          = $("#artistEmail").text();
        this.ps.musicianObject.phoneNumber    = $("#artistPhone").text();
        this.ps.musicianObject.stageName      = $("#stage-name").text();
        this.ps.musicianObject.bio            = $("#bio").text();
        this.backendService.musicianSaveDashboard(this.ps.musicianObject)
        .subscribe((response: any) => {
        });
    }
}
