// Angular imports
import { Component, OnInit } from '@angular/core';

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Component({
    selector: 'app',
    templateUrl: 'main.component.html'
})
export class MainComponent implements OnInit {
    constructor(
    private backendService: BackendService,
    private ps: PersistentService
    ) {
        // Styling jQuery on pageload
        $(document).ready(function () {
            // Nu-Ricks logo shadow effect
            let shadowState: any;
            $("#header").mousemove((e: any) => {
                const width: number = $(e.currentTarget).width();
                const height: number = $(e.currentTarget).height();
                const shadowx: number = e.pageX / width * 10;
                const shadowy: number = e.pageY / height * 10;
                shadowState = shadowx + "px " + shadowy + "px white";
                $(e.currentTarget).find(".title").css("text-shadow", shadowState);
            });

            // Animate scroll to anchor
            $("a[href*='#']").click((e: any) => {
                e.preventDefault();
                $("html, body").animate({
                    scrollTop: $( $.attr(e.currentTarget, "href") ).offset().top
                }, 500);
            });
        });
    }

    ngOnInit() {
        this.backendService.getGlobalTickets()
        .subscribe((response) => {
            if (response.status == "1") {
                const tickets = response.tickets;
                for (var i = 0; i < tickets.length; ++i) {
                    this.backendService.getEventInfoFromID(tickets[i].EventId)
                    .subscribe((response) => {
                        this.ps.globalUserObject.events.push(response);
                    });
                }
            }
        });
    }
}
