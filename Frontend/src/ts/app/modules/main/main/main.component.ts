import { Component } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app',
    templateUrl: 'main.component.html'
})
export class MainComponent{
    constructor() {
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
                shadowState = shadowx + "px " + shadowy + "px #2D2D2D";
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
}
