// Angular imports
import {
    Component,
    Injectable,
    OnInit,
    AfterViewChecked,
    OnDestroy
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
export class MusicianComponent implements OnInit, AfterViewChecked, OnDestroy {
    bioFallback: string = "Edit your page to add a bio";
    private editing: boolean = false;
    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private evs: EventViewerService,
    private router: Router
    ) {
        $(document).ready(function () {
            const $bio = $(".bio");

            /* Profile info save
             */
            $(".edit").click(() => {
                $(".edit").fadeOut(200);
                $(".submit").fadeIn(200);
                $(".bioLinks").delay(200).fadeOut(200);
                $(".bioEditLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "true");
            });

            $(".submit").click(() => {
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

    braintree = require('braintree-web');
    clientKey = "";
    integration: any;
    submit: any;
    form: any;
    popup: any;
    popup_doc: any;

    ngOnInit() {
        this.backendService.getPossibleEvents()
        .subscribe((response: any) => {
            if (response.status == "1") {
                // push is nasty
                this.ps.musicianObject.events = [];
                this.ps.musicianObject.possibleEvents = response.events;
                this.backendService.getMusicianTickets(this.ps.musicianObject.fbid)
                .subscribe((response: any) => {
                    if (response.status == "1") {
                        const tickets = response.tickets;
                        for (var i = 0; i < tickets.length; ++i) {
                            const numberSold = tickets[i].numberSold;
                            this.backendService.getEventInfoFromID(tickets[i].EventId)
                            .subscribe((response) => {
                                if (response.event_info) {
                                    response.event_info._ticketsSold = numberSold;
                                    this.ps.musicianObject.events.push(response.event_info);
                                    // remove from possible events
                                    const pred = (x: any) => {
                                        return x.id;
                                    }
                                    const remIndex = this.ps.musicianObject.possibleEvents.map(pred).indexOf(response.event_info.id);
                                    this.ps.musicianObject.possibleEvents.splice(remIndex, 1);
                                }
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

    ngOnDestroy() {
        if (this.integration) {
            this.integration.teardown();
        }
    }

    cardNewWindow(idex: number): void {
        let t = (screen.height/2)-(250);
        let l = (screen.width/ 2)-(300);
        this.popup = window.open('', '_blank', 'location=0,toolbar=0,resizable=0,top='+t+',left='+l+',menubar=0,height=325,width=600');
        this.popup.document.open();
        this.popup.document.write(`<script src="https://js.braintreegateway.com/web/3.14.0/js/hosted-fields.min.js"></script><style>*,*:before,*:after{box-sizing:inherit}html{box-sizing:border-box;height:100%;overflow:hidden}body{background:#f2f2f2;font-family:'Roboto',verdana,sans-serif;height:100%}h1{font-size:1.5em;font-weight:100}#cardForm{height:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.panel{background:#FFF;width:80%;box-shadow:0 2px 2px 0 rgba(0,0,0,.16),0 0 2px 0 rgba(0,0,0,.12)}.panel__header{background:#3F51B5;color:#FFF}.panel__header,.panel__footer{padding:1em 2em}.panel__footer{background:#f3f3f3}.panel__content{padding:1em 2em;overflow:hidden}.textfield--float-label{width:50%;float:left;display:inline-block}.hosted-field--label{-webkit-transform:translateY(.4em);transform:translateY(.4em);font-size:1.125em;line-height:32px;-webkit-transition:all .15s ease-out;transition:all .15s ease-out;display:block;width:100%;font-weight:400;overflow:hidden;margin-bottom:.5em}.hosted-field--label.label-float,.hosted-field--label.filled,.hosted-field--label.invalid{height:33px;margin-bottom:-1px;-webkit-transform:translate(0,0);transform:translate(0,0);font-size:12px;line-height:15px;text-overflow:ellipsis;color:#2196F3;-webkit-transition:all 0.15s ease-out;transition:all 0.15s ease-out}.hosted-field--label.filled{color:rgba(0,0,0,.54)}.hosted-field--label.invalid{color:#F44336}span.icon{position:relative;top:.2em;margin-right:.2em}svg{fill:#333}.hosted-field{height:32px;margin-bottom:1em;display:block;background-color:transparent;color:rgba(0,0,0,.87);border:none;border-bottom:1px solid rgba(0,0,0,.26);outline:0;width:100%;font-size:16px;padding:0;box-shadow:none;border-radius:0;position:relative}.pay-button{background:#E91E63;color:#fff;margin:0 auto;border:0;border-radius:3px;padding:1em 3em;font-size:1em;text-transform:uppercase;box-shadow:0 0 2px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.2)}.braintree-hosted-fields-focused{border-bottom:2px solid #3F51B5;-webkit-transition:all 200ms ease;transition:all 200ms ease}.braintree-hosted-fields-invalid{border-bottom:2px solid #E91E63;-webkit-transition:all 200ms ease;transition:all 200ms ease}@media (max-width:600px){html{overflow:auto}#cardForm{height:auto;margin:2em;font-size:13px}.panel{width:100%}.textfield--float-label{width:100%;float:none;display:inline-block}.pay-button{width:100%}}</style><form action="javascript:formcallback();" id="cardForm"><div class="panel"><header class="panel__header"><h1>Card Payment</h1></header><div class="panel__content"><div class="textfield--float-label"><label class="hosted-field--label" for="card-number"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg></span>Number of Tickets </label><input type="number" max="100" min="0" id="card-number" class="hosted-field" required></input></div></div><footer class="panel__footer"><button class="pay-button">Pay</button></footer></div></form><script src="https://js.braintreegateway.com/web/3.14.0/js/client.min.js"></script><script src="https://js.braintreegateway.com/web/3.14.0/js/hosted-fields.min.js"></script>`
        );
        this.popup.document.close();
        this.popup_doc = this.popup.document;
        var c = this;
        var eventId = this.ps.musicianObject.events[idex].id;
        this.popup["formcallback"] = function() {
            console.log(c.popup.document);
            var val = c.popup.document.forms["cardForm"][0].value;
            console.log(val);
            c.backendService.getTicketFromEventID(eventId)
            .subscribe((result: any) => {
                var ticketId = -1;
                for (var i = 0; i < result.length; ++i) {
                    if (result.tickets[i].MusicianFbid == c.ps.musicianObject.fbid) {
                        ticketId = result.tickets[i].id;
                        break;
                    }
                }
                c.backendService.initiateTransaction(val, c.ps.musicianObject.customer_id, !!c.ps.userObject.customer_id, ticketId)
                .subscribe((response: any) => {
                    console.log(response);
                    c.popup.close();
                });
            });
        };
    }

    linkToPayment(): void {
        this.router.navigate(['/musicianuser']);
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
