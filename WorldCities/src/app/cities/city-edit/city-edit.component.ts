////import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseFormComponent } from '../../base-form.component';
import { ICountry } from '../../countries/countries';
import { ICity } from '../city';
import { CityService } from '../services/city.service';
  
@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {

  title?: string;
  //form!: FormGroup;
  city?: ICity;
  id?: number;
  countries?: ICountry[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    //private http: HttpClient,
    private cityService: CityService
  ) {
    super()
  }


  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      countryId: new FormControl('', Validators.required),
    }, null, this.isDupeCity());

    this.loadData();
  }

  loadData() {
    this.loadCountries();

    // retrieve the ID from the 'id' parameter
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(idParam);
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      // EDIT MODE
      // fetch the city from the server
      this.cityService.get(this.id)
        .subscribe(res => {
          this.city = res;
          this.title = 'Edit - ' + this.city.name;
          this.form.patchValue(this.city);
        }, err => console.log(err));
    } else {
      // ADD NEW MODE
      this.title = "Create a new City";
    }

  }

  loadCountries() {
    // fetch all the countries from the server
    this.cityService.getCountries(0, 9999, "name", "asc", null, null)
      .subscribe(res => {
        this.countries = res.data;
      }, err => console.log(err));
  }

  onSubmit() {
    let city = this.id ? this.city : <ICity>{};
    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        // EDIT mode
        this.cityService.put(city)
          .subscribe(res => {
            console.log("City " + city!.id + " has been updated.");
            // go back to cities view
            this.router.navigate(['/cities']);
          }, err => console.error(err));
      } else {
        // ADD NEW mode
        this.cityService.post(city)
          .subscribe(res => {
            console.log("City " + res.id + " has been created.");
            // go back to cities view
            this.router.navigate(['/cities']);
          }, error => console.error(error));
      }
    }

  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      //let city = <ICity>{};
      let city = {} as ICity;
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      return this.cityService.isDupeCity(city)
        .pipe(map(res => {
          return res ? { isDupeCity: true } : null;
        }));
    }
  }
}
