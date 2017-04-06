// Angular imports
import { Component, Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";

// Custom imports
import { BackendService } from "../backend/backend.service";
import { PersistentService } from "../main.global";

@Component({
    selector: "adminpanel",
    templateUrl: "adminpanel.component.html"
})
export class AdminPanelComponent {
    constructor(
    private ps: PersistentService
    ){

    }
}
