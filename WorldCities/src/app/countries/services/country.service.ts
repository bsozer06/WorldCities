import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult, BaseService } from '../../base.service';
import { ICountry } from '../countries';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService<ICountry> {

  constructor(http: HttpClient) {
    super(http)
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<ICountry>> {
    const url = this.getUrl("api/Countries");
    let params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }
    return this.http.get<ApiResult<ICountry>>(url, { params });
  }

  get(id: number): Observable<ICountry> {
    const url = this.getUrl("api/Countries/" + id);
    return this.http.get<ICountry>(url);
  }

  put(item: ICountry): Observable<ICountry> {
    const url = this.getUrl("api/Countries/" + item.id);
    return this.http.put<ICountry>(url, item);
  }

  post(item: ICountry): Observable<ICountry> {
    const url = this.getUrl("api/Countries");
    return this.http.post<ICountry>(url, item);
  }

  isDupeField(countryId: number, fieldName: string, fieldValue: string): Observable<boolean> {
    let params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    const url = this.getUrl("api/Countries/IsDupeField");

    return this.http.post<boolean>(url, null, { params });
  }

}
