// Angular imports
import { Component } from '@angular/core';

// Custom imports
import { BackendService } from "../backend/backend.service";

declare var $: any;

@Component({
    selector: 'app',
    templateUrl: 'main.component.html'
})
export class MainComponent{
    constructor(
    private backendService: BackendService
    ) {
        // Styling jQuery on pageload
        $(document).ready(function () {
            // Expand Nu-Ricks logo on hover
            $(".logo").hover((e: any) => {
                $(e.currentTarget).text("Nu-Ricks");
            }, (e: any) => {
                $(e.currentTarget).text("NR");
            });

            // Expand menu on mobile
            $(".hamburger").click(() => {
                $(".hamburger").toggleClass("fold");
                $(".mainWrapper").toggleClass("menuOpen");
            });

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

            // Login panel
            $(".login").click(() => {
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
            });
        });
    }

    musicianFacebookLogin(): void {
        // this.backendService.musicianFacebookLogin()
        // .subscribe((response) => {
        //
        // });
    }
}
