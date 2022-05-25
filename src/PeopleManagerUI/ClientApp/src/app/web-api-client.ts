import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

//export const API_BASE_URL = new InjectionToken<string>('BASE_URL');

export interface IPeopleClient {
  get(): Observable<PersonDto[]>;
  //create(command: CreateTodoItemCommand): Observable<number>;
  //update(id: number, command: UpdateTodoItemCommand): Observable<FileResponse>;
  //delete(id: number): Observable<FileResponse>;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleClient implements IPeopleClient {

  private baseUrl: string;
  private http: HttpClient;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient, @Inject('BASE_URL') baseUrl?: string)
  {
    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
  }

  get(): Observable<PersonDto[]> {
    let url_ = this.baseUrl + "api/person";
    url_ = url_.replace(/[?&]$/, "");
    
    let options_: any = {
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Accept": "application/json"
      })
    };

    return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
      return this.processGet(response_);
    })).pipe(_observableCatch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processGet(response_ as any);
        } catch (e) {
          return _observableThrow(e) as any as Observable<PersonDto[]>;
        }
      } else
        return _observableThrow(response_) as any as Observable<PersonDto[]>;
    }));
  }

  protected processGet(response: HttpResponseBase): Observable<PersonDto[]> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse ? response.body :
        (response as any).error instanceof Blob ? (response as any).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
    if (status === 200) {
      return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);

        //let items = PersonDto[];

        //if (Array.isArray(resultData200["items"])) {
        //  this.items = [] as any;
        //  for (let item of resultData200["items"])
        //    this.items!.push(TodoItemDto.fromJS(item));
        //}

        result200 = PersonDto.fromJS(resultData200);
        return _observableOf(result200);
      }));
    }

    return _observableOf<PersonDto[]>(null as any);
  }
  
}

export class PersonDto implements IPersonDto
{
  id?: number;
  name?: string;
  birthdate?: Date;
  gender?: string;
  email?: string;
  cpf?: string;
  startdate?: Date;
  team?: string | undefined;

  constructor(data?: IPersonDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.id = _data["id"];
      this.name = _data["name"];
      this.birthdate = _data["birthdate"];
      this.gender = _data["gender"];
      this.email = _data["email"];
      this.cpf = _data["cpf"];
      this.startdate = _data["startdate"];
      this.team = _data["team"];
    }
  }

  static fromJS(data: any): PersonDto {
    data = typeof data === 'object' ? data : {};
    let result = new PersonDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["id"] = this.id;
    data["name"] = this.name;
    data["birthdate"] = this.birthdate;
    data["gender"] = this.gender;
    data["email"] = this.email;
    data["cpf"] = this.cpf;
    data["startdate"] = this.startdate;
    data["team"] = this.team;

    return data;
  }
}

export interface IPersonDto {
  id?: number;
  name?: string;
  birthdate?: Date;
  gender?: string;
  email?: string;
  cpf?: string;
  startdate?: Date;
  team?: string | undefined;
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next("");
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = event => {
        observer.next((event.target as any).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}
