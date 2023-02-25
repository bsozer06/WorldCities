////import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ICountry } from './countries';
import { CountryService } from './services/country.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities'];
  public countries!: MatTableDataSource<ICountry>;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadData();
  }


  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    const sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    const sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    const filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    const filterQuery = (this.filterQuery) ? this.filterQuery : null;

    this.countryService.getData(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery).subscribe(res => {
        this.paginator.length = res.totalCount;
        this.paginator.pageIndex = res.pageIndex;
        this.paginator.pageSize = res.pageSize;
        this.countries = new MatTableDataSource<ICountry>(res.data);
      }, err => console.error(err));
  }

  onFilterTextChanged(filterText: string) {
    console.log("before next-", this.filterTextChanged.observers.length)
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged.pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
          console.log(query);
        });
    }
    this.filterTextChanged.next(filterText);
    console.log("after next-",this.filterTextChanged.observers.length)
  }

}
