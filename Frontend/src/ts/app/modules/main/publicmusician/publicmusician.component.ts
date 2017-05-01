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

    braintree = require('braintree-web');
    clientKey = "";
    integration: any;
    submit: any;
    form: any;

    ngOnInit() {
        var c = this;

        this.submit = document.querySelector('input[type="submit"]');
        this.form   = document.querySelector('#checkout-form');

            this.backendService.getClientToken()
            .subscribe((response: any) => {
                console.log(response);
                this.clientKey = response.tok;
                this.braintree.client.create(
                {
                    authorization: this.clientKey
                }, function (clientErr: any, clientInstance: any) {
                    if (clientErr) {
                        return;
                    }
                    c.braintree.hostedFields.create({
                        client: clientInstance,
                        styles: {
                            'input': {
                                'font-size': '14pt'
                            },
                            'input.invalid': {
                                'color': 'red'
                            },
                            'input.valid': {
                                'color': 'green'
                            }
                        },
                        fields: {
                            number: {
                                selector: '#card-number',
                                placeholder: '4111 1111 1111 1111'
                            },
                            cvv: {
                                selector: '#cvv',
                                placeholder: '123'
                            },
                            expirationDate: {
                                selector: '#expiration-date',
                                placeholder: '10/2019'
                            }
                        }
                    }, function (hostedFieldsErr: any, hostedFieldsInstance: any) {
                        if (hostedFieldsErr) {
                            // Handle error in Hosted Fields creation
                            return;
                        }

                        c.submit.removeAttribute('disabled');
                        c.form.addEventListener('submit', function (event: any) {
                            event.preventDefault();

                            hostedFieldsInstance.tokenize(function (tokenizeErr: any, payload: any) {
                                if (tokenizeErr) {
                                    // Handle error in Hosted Fields tokenization
                                    return;
                                }
                                var u = {
                                    payment_method_nonce: payload.nonce
                                }

                                c.backendService.createPaymentInformation(c.ps.userObject.fbid, u)
                                .subscribe((response: any) => {
                                    console.log(response);
                                    if (response.status = "1") {
                                        const customer_id = response.user.customer_id;
                                        const b = {
                                            customerId: customer_id,
                                            isUser: true,
                                            amount: 2
                                        }
                                        // c.backendService.initiateTransaction(b)
                                        // .subscribe((response: any) => {
                                        //
                                        // });
                                    }
                                });
                            });
                        }, false);
                    });
                }
                );
            });

        this.backendService.getMusicianTickets(this.pm.p_musicianObject.fbid)
        .subscribe((response: any) => {
            if (response.status == "1") {
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
}
