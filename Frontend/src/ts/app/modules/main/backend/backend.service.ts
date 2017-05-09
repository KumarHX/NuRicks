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
        return this.http.get(`${this.backendUrl}/musicians/getMusicianInfoFromURL/${id}`, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMusicianFromFbid(id: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/musicians/getMusicianInfoFromID/${id}`, { withCredentials: true })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getClientToken(): Observable<any> {
        return this.http.get(`${this.backendUrl}/transactions/getClientToken`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createPaymentInformation(fbid: string, paymentObj: any): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify(paymentObj);
        return this.http.post(`${this.backendUrl}/users/createPaymentInformation/${fbid}`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    initiateTransaction(amount: string, customerId: string, isUser: boolean, ticketId: number): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            amount: amount,
            customerId: customerId,
            isUser: isUser,
            ticketId: ticketId
        });
        return this.http.post(`${this.backendUrl}/transactions/initiateTransaction/`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateEmail(fbid: string, email: string): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            fbid: fbid,
            email: email
        });
        return this.http.post(`${this.backendUrl}/users/updateUserInfo`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteCustomerPaymentInfo(fbid: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/users/deleteCustomerPaymentInfo/${fbid}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    musicianDeleteCustomerPaymentInfo(fbid: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/musicians/deleteCustomerPaymentInfo/${fbid}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteMusician(fbid: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/musicians/deleteMusician/${fbid}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    musicianCreatePaymentInformation(fbid: string, paymentObj: any): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify(paymentObj);
        return this.http.post(`${this.backendUrl}/musicians/createPaymentInformation/${fbid}`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    musicianSaveDashboard(musicianObject: any): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            fbid:           musicianObject.fbid,
            email:          musicianObject.email,
            phoneNumber:    musicianObject.phoneNumber,
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

    getMusicianTickets(id: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/tickets/queryTicketByMusician/${id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getMusicianTicketsURL(url: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/tickets/queryTicketByMusicianURL/${url}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getGlobalTickets(): Observable<any> {
        return this.http.get(`${this.backendUrl}/tickets/queryGlobalTickets`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getPossibleEvents(): Observable<any> {
        return this.http.get(`${this.backendUrl}/events/queryPossibleEvents`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEventInfoFromID(id: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/events/getEventInfoFromID/${id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTicketFromEventID(id: string): Observable<any> {
        return this.http.get(`${this.backendUrl}/tickets/queryTicketByEventID/${id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTransactionHistory(customer_id: string): Observable<any> {

        return this.http.get(`${this.backendUrl}/transactions/getTransactionsByIDUSER/${customer_id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createTicket(fbid: string, eventId: number): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            numberSold: 0,
            isGlobal: false,
            createdAt: Date(),
            updatedAt: Date(),
            MusicianFbid: fbid,
            EventId: eventId
        })
        return this.http.post(`${this.backendUrl}/tickets/createTicket`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    adminLogin(username: string, password: string): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify({
            "username": username,
            "password": password
        })
        return this.http.post(`${this.backendUrl}/admins/login`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createEvent(formobj: any): Observable<any> {
        let headers = new Headers({ "Content-Type": "application/json", "Accept": "application/json" });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        const body: string = JSON.stringify(formobj);
        return this.http.post(`${this.backendUrl}/events/createEvent`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllMusicians(): Observable<any> {
        return this.http.get(`${this.backendUrl}/musicians/allMusicians`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllEvents(): Observable<any> {
        return this.http.get(`${this.backendUrl}/events/allEvents`)
            .map(this.extractData)
            .catch(this.handleError);
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
