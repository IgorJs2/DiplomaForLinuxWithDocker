import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Region} from "../models/region.model";

@Injectable({
    providedIn: 'root'
})
export class RegionService {
    baseUrl = environment.baseUrl

    constructor(private http: HttpClient) {
    }

    public getRegions(): Observable<Region[]> {
        return this.http.get<Region[]>(this.baseUrl + '/region/')
    }

    public getRegion(id: number): Observable<Region> {
        return this.http.get<Region>(this.baseUrl + `/region/${id}`)
    }
}
