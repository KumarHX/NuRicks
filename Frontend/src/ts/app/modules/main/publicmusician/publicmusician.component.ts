// Angular imports
import { Component, Injectable, OnInit } from "@angular/core";
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
    urlid: string;
    p_events: any = [];

    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.backendService.getMusician(this.urlid = route.params["id"])
        .map((response: any) => {
            if (response.status == "1" && response.musician_info) {
                const a = response.musician_info;
                this.p_musicianObject.fbid = a.fbid;
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
export class PublicMusicianComponent implements OnInit {
    bioFallback: string = "This musician doesn't have a bio";
    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private pm: PublicMusicianService,
    private router: Router
    ) {

    }

    linkToPayment(): void {
        if (this.ps.musicianObject.fbid) {
            this.router.navigate(['/musicianuser']);
        }
        else if (this.ps.userObject.fbid) {
            this.router.navigate(['/user']);
        }
        else {
            if (!$("body").hasClass("drop")) {
                $("body").addClass("drop");
                $(".loginOverlay").delay(250).fadeIn();
            }
            else {
                $(".loginOverlay").fadeOut().queue((next: any) => {
                    $("body").removeClass("drop");
                    next();
                })
            }
        }
    }

    ngOnInit() {
        this.backendService.getMusicianTickets(this.pm.p_musicianObject.fbid)
        .subscribe((response: any) => {
            if (response.status == "1") {
                this.pm.p_events = [];
                const tickets = response.tickets;
                for (var i = 0; i < tickets.length; ++i) {
                    this.backendService.getEventInfoFromID(tickets[i].EventId)
                    .subscribe((response) => {
                        if (response.status == "1") {
                            this.pm.p_events.push(response.event_info);
                        }
                    });
                }
            }
        });
    }

    braintree = require('braintree-web');
    clientKey = "";
    integration: any;
    submit: any;
    form: any;
    popup: any;
    popup_doc: any;

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
        const party = c.ps.userObject || c.ps.musicianObject;
        const event = this.pm.p_events[idex];
        var eventId = this.pm.p_events[idex].id;
        var eventCost = this.pm.p_events[idex].cost;
        this.popup["formcallback"] = function() {
            console.log(c.popup.document);
            var val = c.popup.document.forms["cardForm"][0].value;
            console.log(val);
            c.backendService.getTicketFromEventID(eventId)
            .subscribe((result: any) => {
                console.log(result);
                var ticketId = -1;
                var ticket: any;
                for (var i = 0; i < result.tickets.length; ++i) {
                    if (result.tickets[String(i)].MusicianFbid == c.pm.p_musicianObject.fbid) {
                        ticketId = result.tickets[String(i)].id;
                        ticket = result.tickets[String(i)];
                        break;
                    }
                }
                c.backendService.initiateTransaction(val, eventCost, party.customer_id, !!c.ps.userObject.customer_id, ticketId)
                .subscribe((response: any) => {
                    console.log(response);
                    this.backendService.sendEmail(event, party, ticket.stageName, val)
                    .subscribe((response: any) => {
                        if (status == "1") {
                            console.log("Email Sent");
                        }
                    });
                    c.popup.close();
                });
            });
        };
    }
}
