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

@Component({
    selector: "musicianuser",
    templateUrl: "musicianuser.component.html"
})
export class MusicianUserComponent implements OnInit {
    constructor(
    private ps: PersistentService,
    private backendService: BackendService
    ){}

    private transactions: any = [];

    ngOnInit() {
        $(document).ready(function() {
            $('.userTabs').children().click(function (e: any) {
                var toShow = "." + $(e.currentTarget).attr('data-show');
                $('.userTabs').children().removeClass('activeTab');
                $(e.currentTarget).addClass('activeTab');
                $('._userpanel').hide(150);
                $(toShow).delay(150).show();
            });
        });
        if (this.ps.musicianObject.customer_id) {
            this.backendService.getTransactionHistory(this.ps.musicianObject.customer_id)
            .subscribe((response) => {
                this.transactions = response.transactions;
                console.log(response.transactions);
            });
        }
    }

    braintree = require('braintree-web');
    clientKey = "";
    integration: any;
    submit: any;
    form: any;
    popup: any;
    popup_doc: any;

    cardNewWindow(): void {
        let t = (screen.height/2)-(250);
        let l = (screen.width/ 2)-(300);
        this.popup = window.open('', '_blank', 'toolbar=0,resizable=0,top='+t+',left='+l+',menubar=0,height=500,width=600');
        this.popup.document.open();
        this.popup.document.write(`<script src="https://js.braintreegateway.com/web/3.14.0/js/hosted-fields.min.js"></script><style id=_card_styling>*,:after,:before{box-sizing:inherit}html{box-sizing:border-box;height:100%;overflow:hidden}body{background:#f2f2f2;font-family:Roboto,verdana,sans-serif;height:100%}h1{font-size:1.5em;font-weight:100}#cardForm{height:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.panel{background:#fff;width:80%;box-shadow:0 2px 2px 0 rgba(0,0,0,.16),0 0 2px 0 rgba(0,0,0,.12)}.panel__header{background:#3f51b5;color:#fff}.panel__footer,.panel__header{padding:1em 2em}.panel__footer{background:#f3f3f3}.panel__content{padding:1em 2em;overflow:hidden}.textfield--float-label{width:50%;float:left;display:inline-block}.hosted-field--label{-webkit-transform:translateY(.4em);transform:translateY(.4em);font-size:1.125em;line-height:32px;-webkit-transition:all .15s ease-out;transition:all .15s ease-out;display:block;width:100%;font-weight:400;overflow:hidden;margin-bottom:.5em}.hosted-field--label.filled,.hosted-field--label.invalid,.hosted-field--label.label-float{height:33px;margin-bottom:-1px;-webkit-transform:translate(0,0);transform:translate(0,0);font-size:12px;line-height:15px;text-overflow:ellipsis;color:#2196f3;-webkit-transition:all .15s ease-out;transition:all .15s ease-out}.hosted-field--label.filled{color:rgba(0,0,0,.54)}.hosted-field--label.invalid{color:#f44336}span.icon{position:relative;top:.2em;margin-right:.2em}svg{fill:#333}.hosted-field{height:32px;margin-bottom:1em;display:block;background-color:transparent;color:rgba(0,0,0,.87);border:none;border-bottom:1px solid rgba(0,0,0,.26);outline:0;width:100%;font-size:16px;padding:0;box-shadow:none;border-radius:0;position:relative}.pay-button{background:#e91e63;color:#fff;margin:0 auto;border:0;border-radius:3px;padding:1em 3em;font-size:1em;text-transform:uppercase;box-shadow:0 0 2px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.2)}.braintree-hosted-fields-focused{border-bottom:2px solid #3f51b5;-webkit-transition:all .2s ease;transition:all .2s ease}.braintree-hosted-fields-invalid{border-bottom:2px solid #e91e63;-webkit-transition:all .2s ease;transition:all .2s ease}@media (max-width:600px){html{overflow:auto}#cardForm{height:auto;margin:2em;font-size:13px}.panel{width:100%}.textfield--float-label{width:100%;float:none;display:inline-block}.pay-button{width:100%}}</style><form action="" id=cardForm method=post><div class=panel><header class=panel__header><h1>Card Payment</h1></header><div id=error-message></div><div class=panel__content><div class=textfield--float-label><label class=hosted-field--label for=card-number><span class=icon><svg height=20 viewBox="0 0 24 24"width=20 xmlns=http://www.w3.org/2000/svg><path d="M0 0h24v24H0z"fill=none /><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> </span>Card Number</label><div class=hosted-field id=card-number name=card-number></div></div><div class=textfield--float-label><label class=hosted-field--label for=cvv><span class=icon><svg height=20 viewBox="0 0 24 24"width=20 xmlns=http://www.w3.org/2000/svg><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> </span>CVV</label><div class=hosted-field id=cvv name=cvv></div></div><div class=textfield--float-label><label class=hosted-field--label for=expiration-date><span class=icon><svg height=20 viewBox="0 0 24 24"width=20 xmlns=http://www.w3.org/2000/svg><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg> </span>Expiration Date</label><div class=hosted-field id=expiration-date name=expiration-date></div></div></div><input name=payment_method_nonce type=hidden><footer class=panel__footer><button class=pay-button type="submit">Add Card</button></footer></div></form>`
        );
        this.popup_doc = this.popup.document;
        this.submit = this.popup_doc.querySelector('.pay-button');
        this.form   = this.popup_doc.querySelector('#cardForm');
        var c = this;
        this.backendService.getClientToken()
        .subscribe((response: any) => {
            this.clientKey = response.tok;
            this.braintree.client.create(
            {
                authorization: this.clientKey
            }, function (clientErr: any, clientInstance: any) {
                if (clientErr) {
                    return;
                }
                $(c.popup_doc).ready(function() {
                    c.popup["braintree"].hostedFields.create({
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
                        let form = c.popup_doc.querySelector("#cardForm");
                        if (hostedFieldsErr) {
                            // Handle error in Hosted Fields creation
                            return;
                        }

                        // c.submit.removeAttribute('disabled');
                        form.addEventListener('submit', function (event: any) {
                            event.preventDefault();
                            hostedFieldsInstance.tokenize(function (tokenizeErr: any, payload: any) {
                                if (tokenizeErr) {
                                    // Handle error in Hosted Fields tokenization
                                    return;
                                }
                                var u = {
                                    payment_method_nonce: payload.nonce
                                }

                                c.backendService.musicianCreatePaymentInformation(c.ps.musicianObject.fbid, u)
                                .subscribe((response: any) => {
                                    console.log(response);
                                    c.ps.musicianObject.customer_id = response.user.customer_id;
                                    c.popup.close();
                                });
                            });
                        }, false);
                    });
                });
            });
        });
    }

    deletePaymentMethod(): void {
        this.backendService.musicianDeleteCustomerPaymentInfo(this.ps.musicianObject.fbid)
        .subscribe((response) => {
            if (response.status == "1") {
                this.ps.musicianObject.customer_id = null;
            }
        })
    }
}
