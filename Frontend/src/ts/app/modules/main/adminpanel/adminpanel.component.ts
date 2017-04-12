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

    private ticketView: any = {
        "tickets": []
    }

    private index: number = 0;

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
                for (this.index = 0; this.index < response.events.length; ++this.index) {
                    const id = response.events[this.index].id;
                    this.backendService.getTicketFromEventID(id)
                    .subscribe((response) => {
                        for (var j = 0; j < this.as.events.length; ++j) {
                            if (response.tickets[0] && this.as.events[j].id == response.tickets[0].EventId) {
                                this.as.events[j].tickets = response.tickets;
                            }
                            else {
                                this.as.events[j].tickets = [];
                            }
                        }
                        console.log(this.as.events);
                    });
                }
            }
        });
    }

    getMusician(idex: number): void {
        this.musicianView = this.as.musicians[idex];
        $('#musicianModal').fadeIn(150);
    }

    getEvent(idex: number): void {
        this.ticketView = this.as.events[idex].tickets;
        $('#ticketModal').fadeIn(150);
    }

    addShow(form: any): void {
        form.zip_code = parseInt(form.zip_code);
        form.cost = parseInt(form.cost);
        form.extraAtDoor = parseInt(form.extraAtDoor);
        form.numberNeededToSell = parseInt(form.numberNeededToSell);
        form.isPossibleEvent = form.isPossibleEvent == "" ? false : true;
        form.eventDate = new Date($("#day").val() + " " + $("#month").val() + " " + $("#year").val());
        form.ShowStarts = form.ShowStarts + " " + $("#startMeridian").val();
        form.doorsOpen = form.doorsOpen + " " + $("#openMeridian").val();
        this.backendService.createEvent(form)
        .subscribe((response: any) => {
            if (response.status == "1") {
                window.scrollTo(0,0);
                $(".createSuccess").show().delay(2500).fadeOut();
            }
        });
    }
}
