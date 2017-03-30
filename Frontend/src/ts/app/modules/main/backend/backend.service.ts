// Angular imports
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";

// Custom imports
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";

@Injectable()
export class BackendService {
    backendUrl: string = "http://localhost:3000/api";

    constructor(
        private http: Http
    ) { }

    checkAuth(): Observable<any> {
        // check for musician or user on backend
        // return user
        return this.http.get(`${this.backendUrl}/auth/`, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMusician(id: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/musicians/getMusicianInfoFromID/${id}`, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    musicianSaveDashboard(musicianObject: any): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            fbid:           musicianObject.fbid,
            email:          musicianObject.email,
            stageName:      musicianObject.stageName,
            bio:            musicianObject.bio,
            soundcloudLink: musicianObject.soundcloudLink,
            instagramLink:  musicianObject.instagramLink,
            youtubeLink:    musicianObject.youtubeLink,
            facebookLink:   musicianObject.facebookLink,
            picture_url:    musicianObject.picture_url
        });

        return this.http.post(`${this.backendUrl}/musicians/updateMusicianInfo`, body, options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    logout(): Observable<any> {
        return this.http.get(`${this.backendUrl}/auth/logout`, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    handleError(error: any): any {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "Server error";
        // Return the error
        return Observable.throw(errMsg);
    }
}
