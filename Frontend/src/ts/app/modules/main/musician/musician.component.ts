// Angular imports
import { Component } from '@angular/core';

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

declare var $: any;

@Component({
    selector: 'musician',
    templateUrl: 'musician.component.html'
})
export class MusicianComponent {
    constructor(
    private backendService: BackendService,
    private ps: PersistentService
    ) {

    }
}
