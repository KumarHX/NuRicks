// Angular imports
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Component({
    selector: 'nuricks-nav',
    templateUrl: 'nav.component.html'
})
export class NavComponent {
    constructor(
    private backendService: BackendService,
    private ps: PersistentService,
    private router: Router
    ) {
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

            // dissolve navbar when not at top
            $(window).scroll(() => {
                const navbar = $("nav");
                if ($(window).scrollTop() == 0) {
                    navbar.fadeIn(200);
                }
                else {
                    navbar.fadeOut(200);
                }
            });

            $("#mLogin").click(() => {
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
    logout(): void {
        this.router.navigate(['/']);
        this.backendService.logout()
        .subscribe((response: any) => {
            if (response.status) {
                location.reload();
            }
        });
    }
}
