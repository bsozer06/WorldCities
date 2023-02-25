import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult, BaseService } from '../../base.service';
import { ICountry } from '../../countries/countries';
import { ICity } from '../city';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<ICity> {

  constructor(http: HttpClient) {
    super(http)
  }

  override getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<ICity>> {
    const url = this.getUrl("api/cities");
    let params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn.toString())
      .set("sortOrder", sortOrder.toString());

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn.toString())
        .set("filterQuery", filterQuery.toString());
    }

    return this.http.get<ApiResult<ICity>>(url, { params });
  }

  override get(id: number): Observable<ICity> {
    const url = this.getUrl(`api/cities/${id}`);
    return this.http.get<ICity>(url);
  }

  override put(item: ICity): Observable<ICity> {
    var url = this.getUrl("api/Cities/" + item.id);
    return this.http.put<ICity>(url, item);
  }

  override post(item: ICity): Observable<ICity> {
    var url = this.getUrl("api/Cities");
    return this.http.post<ICity>(url, item);
  }

  getCountries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<ICountry>> {
    const url = super.getUrl('api/countries');
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

  isDupeCity(item: ICity): Observable<boolean> {
    var url = this.getUrl("api/cities/isDupeCity");
    return this.http.post<boolean>(url, item);
  }
}
