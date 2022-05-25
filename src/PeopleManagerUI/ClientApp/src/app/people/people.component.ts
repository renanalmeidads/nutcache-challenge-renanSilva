import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Inject, TemplateRef } from '@angular/core';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  team = Team;

  newPersonModalRef!: BsModalRef;
  editPersonModalRef!: BsModalRef;
  deletePersonModalRef!: BsModalRef;

  newPersonEditor: any = {};
  editPersonEditor: any = {};
  deleteSelectedPerson: IPersonDto | undefined;
  selectedPerson: number = 0;

  selectedGender: string = "Gender...";

  genderList: any[] = [{ id: 0, value: 'Masculine' }, { id: 1, value: 'Feminine' }, { id: 2, value: 'Other' }];
  teamList: any[] = [{ id: -1, value: 'Selecione...' }, { id: 0, value: 'Mobile' }, { id: 1, value: 'Frontend' }, { id: 2, value: 'Backend' }];

  private http: HttpClient;
  private baseUrl: string;
  public people: IPersonDto[] = [];

  constructor(@Inject(HttpClient) http: HttpClient, @Inject('API_BASE_URL') baseUrl: string, private modalService: BsModalService) {

    http.get<IPersonDto[]>(baseUrl + 'api/person').subscribe(result => {
      this.people = result;
    }, error => console.error(error));

    this.http = http;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
  }

  addPerson(): void {
    let url_ = this.baseUrl + "api/person";
    url_ = url_.replace(/[?&]$/, "");

    let parsedStartDate = moment(this.newPersonEditor.startDate, "MMYYYY");
    let parsedBirthDate = new Date(this.newPersonEditor.birthDate.year, this.newPersonEditor.birthDate.month - 1, this.newPersonEditor.birthDate.day);

    const content_ = JSON.stringify(<CreatePersonCommand><unknown>{
            name: this.newPersonEditor.name,
            email: this.newPersonEditor.email,
            birthDate: parsedBirthDate,
            cpf: this.newPersonEditor.cpf,
            gender: this.newPersonEditor.gender,
            startDate: parsedStartDate,
            team: this.newPersonEditor.team
        });

    let options_: any = {
      body: content_,
      responseType: "text",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json"
      })
    };

    this.http.request("post", url_, options_).pipe(
      map(m => m)
    ).subscribe(response => {
      console.info('Person registered - id: ' + response);

      const person: IPersonDto =
      {
        id: Number(response),
        name: this.newPersonEditor.name,
        email: this.newPersonEditor.email,
        birthDate: this.newPersonEditor.birthDate,
        gender: this.newPersonEditor.gender,
        cpf: this.newPersonEditor.cpf,
        startDate: parsedStartDate.toDate(),
        team: this.newPersonEditor.team
      }

      this.people.push(person);

      this.newPersonModalRef.hide();
      this.newPersonEditor = {};

    }, error => {

    });
  }

  editPerson(): void {
    let url_ = this.baseUrl + "api/person/update/" + this.selectedPerson;
    url_ = url_.replace(/[?&]$/, "");

    let parsedStartDate = moment(this.editPersonEditor.startDate, "MMYYYY");
    let parsedBirthDate = new Date(this.editPersonEditor.birthDate.year, this.editPersonEditor.birthDate.month - 1, this.editPersonEditor.birthDate.day);

    const content_ = JSON.stringify(<UpdatePersonCommand><unknown>{
      id: this.editPersonEditor.id,
      name: this.editPersonEditor.name,
      email: this.editPersonEditor.email,
      birthDate: parsedBirthDate,
      cpf: this.editPersonEditor.cpf,
      gender: this.editPersonEditor.gender,
      startDate: parsedStartDate,
      team: this.editPersonEditor.team
    });

    let options_: any = {
      body: content_,
      responseType: "text",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json"
      })
    };

    this.http.request("put", url_, options_).pipe(
      map(m => m)
    ).subscribe(response => {

      const person: IPersonDto =
      {
        id: this.selectedPerson,
        name: this.editPersonEditor.name,
        email: this.editPersonEditor.email,
        birthDate: parsedBirthDate,
        gender: this.editPersonEditor.gender,
        cpf: this.editPersonEditor.cpf,
        startDate: parsedStartDate.toDate(),
        team: this.editPersonEditor.team
      }

      const oldPerson = this.people.filter(({ id }) => id === this.selectedPerson)[0];

      const index: number = this.people.indexOf(oldPerson);

      if (index !== -1) {
        this.people[index] = person;
      }

      this.editPersonModalRef.hide();
      this.editPersonEditor = {};

    }, error => {

    });
  }

  deletePersonConfirmed(): void
  {
    let url_ = this.baseUrl + "api/person/" + this.deleteSelectedPerson?.id;
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify({ id: this.deleteSelectedPerson?.id });

    let options_: any = {
      body: content_,
      responseType: "text",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json"
      })
    };

    this.http.request("delete", url_, options_).pipe(
      map(m => m)
    ).subscribe(response => {

      const oldPerson = this.people.filter(({ id }) => id === this.deleteSelectedPerson?.id)[0];

      const index: number = this.people.indexOf(oldPerson);

      if (index !== -1) {
        this.people.splice(index, 1);
      }

      this.deletePersonModalRef.hide();
      this.deleteSelectedPerson = undefined;

    }, error => {

    });
  }

  showDeletePersonModal(template: TemplateRef<any>, item: IPersonDto): void {

    this.deleteSelectedPerson = item;

    this.deletePersonModalRef = this.modalService.show(template);
  }

  showNewPersonModal(template: TemplateRef<any>): void {
    this.newPersonModalRef = this.modalService.show(template);
  }

  showEditPersonModal(template: TemplateRef<any>, item: IPersonDto): void {

    console.info(item);

    this.selectedPerson = item.id;

    this.editPersonEditor.id = item.id;
    this.editPersonEditor.name = item.name;

    const birthMoment: moment.Moment = moment(item.birthDate);
    const objBeginDate = { year: birthMoment.year(), month: birthMoment.month() + 1, day: birthMoment.date() };
    this.editPersonEditor.birthDate = objBeginDate;

    this.editPersonEditor.gender = item.gender;
    this.editPersonEditor.email = item.email;
    this.editPersonEditor.cpf = item.cpf;
    this.editPersonEditor.startDate = moment(item.startDate).format('MM/YYYY');
    this.editPersonEditor.team = item.team;

    this.editPersonModalRef = this.modalService.show(template);
  }

  changeGender(gender: string) {
    this.selectedGender = gender;
  }
}

interface IPersonDto
{
  id: number,
  name: string;
  birthDate: Date;
  startDate: Date;
  gender: number;
  cpf: string;
  email: string;
  team: number;
}

class UpdatePersonCommand implements IUpdatePersonCommand {
  name: string | undefined;
  birthDate: Date | undefined;
  gender: string | undefined;
  email: string | undefined;
  cpf: string | undefined;
  startDate: Date | undefined;
  team?: number;
}

interface IUpdatePersonCommand {
  name: string | undefined;
  birthDate: Date | undefined;
  gender: string | undefined;
  email: string | undefined;
  cpf: string | undefined;
  startDate: Date | undefined;
  team?: number;
}

class CreatePersonCommand implements ICreatePersonCommand
{
  name: string | undefined;
  birthDate: Date | undefined;
  gender: string | undefined;
  email: string | undefined;
  cpf: string | undefined;
  startDate: Date | undefined;
  team?: number;
}

interface ICreatePersonCommand
{
  name: string | undefined;
  birthDate: Date | undefined;
  gender: string | undefined;
  email: string | undefined;
  cpf: string | undefined;
  startDate: Date | undefined;
  team?: number;
}

enum Team {
  None = -1,
  Mobile = 0,
  Frontend = 1,
  Backend = 2
}

function convertToLocalDate(responseDate: any) {
  try {
    if (responseDate != null) {
      if (typeof (responseDate) === 'string') {
        if (String(responseDate.indexOf('T') >= 0)) {
          responseDate = responseDate.split('T')[0];
        }
        if (String(responseDate.indexOf('+') >= 0)) {
          responseDate = responseDate.split('+')[0];
        }
      }

      responseDate = new Date(responseDate);
      const newDate = new Date(responseDate.getFullYear(), responseDate.getMonth(), responseDate.getDate(), 0, 0, 0);
      const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;

      const finalDate: Date = new Date(newDate.getTime() - userTimezoneOffset);
      return finalDate;
    } else {
      return null;
    }
  } catch (error) {
    return responseDate;
  }
}
