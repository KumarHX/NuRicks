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
        urlValue: "",
        verified: false,
    };

    private ticketView: any = {
        eventName: '',
        tickets: []
    };

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
            $('.showImg').click(function (e: any) {
                const ele = $('.adminTabs').children()[1];
                const toShow = "." + $(ele).attr('data-show');
                $('.adminTabs').children().removeClass('active');
                $(ele).addClass('active');
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

    eventCallback(index: number): void {
        if (this.as.events[index]) {
            this.backendService.getTicketFromEventID(this.as.events[index].id)
            .subscribe((response: any) => {
                if (response.status == "1") {
                    this.as.events[index].tickets = response.tickets;
                    this.eventCallback(index+1);
                }
            });
        }
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
                this.eventCallback(0);
            }
        });
    }

    getMusician(idex: number): void {
        this.musicianView = this.as.musicians[idex];
        $('#musicianModal').fadeIn(150);
    }

    getMusicianNet(i: number) {
        this.backendService.getMusicianFromFbid(this.ticketView.tickets[i].MusicianFbid)
        .subscribe((response: any) => {
            this.ticketView.tickets[i].firstName = response.musician_info.firstName;
            this.ticketView.tickets[i].lastName  = response.musician_info.lastName;
            this.ticketView.tickets[i].stageName = response.musician_info.stageName;
            this.ticketView.tickets[i].phoneNumber = response.musician_info.phoneNumber;
            ++i;
            if (i < this.ticketView.tickets.length) {
                this.getMusician(i);
            }
        });
    }

    getEvent(idex: number): void {
        this.ticketView.tickets = this.as.events[idex].tickets;
        this.ticketView.eventName = this.as.events[idex].eventName;
        if (this.ticketView.tickets && this.ticketView.tickets.length > 0) {
            this.getMusicianNet(0);
        }
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
