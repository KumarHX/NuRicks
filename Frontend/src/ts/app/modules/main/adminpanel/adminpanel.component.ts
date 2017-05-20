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

    deleteMusician(idex: number): void {
        this.backendService.deleteMusician(this.as.musicians[idex].fbid)
        .subscribe((response: any) => {
            console.log(response);
            if (response["status"] == "1") {
                this.as.musicians.splice(idex, 1);
            }
        });
    }

    getMusician(idex: number): void {
        this.musicianView = this.as.musicians[idex];
        $('#musicianModal').fadeIn(150);
    }

    saveMusician(idex: number): void {
        var mu = this.as.musicians[idex];

        mu.firstName = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(2) h2 span:nth-child(1)`)[0].childNodes[0].data;
        mu.lastName = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(2) h2 span:nth-child(2)`)[0].childNodes[0].data;
        mu.stageName = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(3) h2`)[0].childNodes[0].data;
        mu.email = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(4) h2`)[0].childNodes[0].data;
        mu.phoneNumber = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(5) h2`)[0].childNodes[0].data;
        mu.fbid = $(`#musicianTable tbody tr:nth-child(${idex+2}) td:nth-child(7) h2`)[0].childNodes[0].data;

        if (mu.stageName == "Not Specified") {
            mu.stageName = "";
        }
        if (mu.email == "Not Specified") {
            mu.email = "";
        }
        if (mu.phoneNumber == "Not Specified") {
            mu.phoneNumber = "";
        }

        this.backendService.musicianSaveDashboard(mu)
        .subscribe((response: any) => {
            if (response.status == "1") {
                console.log("UPDATE OK");
            }
        });
    }

    editEvent(idex: number): void {
        var event = this.as.events[idex];
        event.eventName = $(`.showBlock:nth-child(${idex+1}) h1`)[0].innerHTML;
        event.headliner = $(`.showBlock:nth-child(${idex+1}) span`)[0].innerHTML;
        event.street_name = $(`.showBlock:nth-child(${idex+1}) span`)[1].innerHTML;
        event.venue = $(`.showBlock:nth-child(${idex+1}) span`)[2].innerHTML;
        event.city = $(`.showBlock:nth-child(${idex+1}) span`)[3].innerHTML
        event.state = $(`.showBlock:nth-child(${idex+1}) span`)[4].innerHTML
        event.zip_code = $(`.showBlock:nth-child(${idex+1}) span`)[5].innerHTML
        event.eventDate = new Date($(`.showBlock:nth-child(${idex+1}) span`)[6].innerHTML);
        event.cost = ($(`.showBlock:nth-child(${idex+1}) span`)[7].innerHTML).slice(1);

        this.backendService.updateEventInfo(event)
        .subscribe((response: any) => {
            if (response.status == "1") {
                console.log("EVENT UPDATE OK");
            }
        });
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
