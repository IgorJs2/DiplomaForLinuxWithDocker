import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Category} from "../models/category.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    baseUrl = environment.baseUrl

    constructor(private http: HttpClient) {
    }

    public getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl + '/category/')
    }

    public getCategory(id: number): Observable<Category> {
        return this.http.get<Category>(this.baseUrl + `/category/${id}`)
    }

    public createCategory(body: object): Observable<Category> {
        return this.http.post<Category>(this.baseUrl + `/category/`, body)
    }

    public updateCategory(id: number, category: object): Observable<Category> {
        return this.http.put<Category>(this.baseUrl + `/category/${id}/`, category)
    }

    public deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + `/category/${id}`)
    }

    public getCategoryByRegion(regionId: number): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl + `/categoryByRegion/?region_id=${regionId}`)
    }
}
