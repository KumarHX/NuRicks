// Angular imports
import {
    NgModule,
    Pipe,
    PipeTransform
} from '@angular/core';
import { CommonModule } from "@angular/common";
import { DomSanitizer } from '@angular/platform-browser';
const linkify = require('linkifyjs');
const linkifyStr = require('linkifyjs/string');

declare var SC: any;

@Pipe({ name : 'embed' })
export class EmbedPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer){}
    transform(content: string) {
        const regex = new RegExp(/([\S]+)?(soundcloud\.com[^\s]+)/g);
        const thot = this;
        function recurse(capture: any) {
            if (capture != null) {
                if (capture[2]) {
                    const soundcloudLink = "https://" + capture[2];
                    return SC.oEmbed(soundcloudLink, {auto_play: false}).then(function(oEmbed: any) {
                        recurse(regex.exec(content));
                        return thot.sanitizer.bypassSecurityTrustHtml(linkifyStr(content, {target: '_blank'}) + " " + oEmbed.html);
                    });
                }
            }
            else {
                return content;
            }
        }
        return recurse(regex.exec(content));
    }
}

@NgModule({
    declarations: [EmbedPipe],
    imports: [CommonModule],
    exports: [EmbedPipe]
})
export class MainPipe{}
