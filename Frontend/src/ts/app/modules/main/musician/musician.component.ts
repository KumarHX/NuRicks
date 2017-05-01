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
                // $(".uploadBanner").fadeIn(250);
                $(".bioLinks").delay(200).fadeOut(200);
                $(".bioEditLinks").delay(400).fadeIn(200);
                $bio.find(".title, div").attr("contenteditable", "true");
            });

            $(".submit").click(() => {
                // $(".uploadBanner").fadeOut(200);
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

                                c.backendService.createPaymentInformation(c.ps.musicianObject.fbid, u)
                                .subscribe((response: any) => {
                                    console.log(response);
                                });
                            });
                        }, false);
                    });
                }
                );
            });


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
        this.integration.teardown();
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
