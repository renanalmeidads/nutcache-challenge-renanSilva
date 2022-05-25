import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, TemplateRef } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  faPlus = faPlus;
  newPersonModalRef!: BsModalRef;
  
  newPersonEditor: any = {};

  selectedGender: string = "Gender...";

  genderList: string[] = ["Masculine", "Feminine", "Other"];

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

    let idPerson = 0;

    const content_ = JSON.stringify(<CreatePersonCommand>{
      name: this.newPersonEditor.name,
      email: this.newPersonEditor.email,
      birthDate: new Date(),
      cpf: '03722003385',
      gender: this.newPersonEditor.gender,
      startDate: new Date(),
      team: 0
    });

    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json"
      })
    };

    this.http.request("post", url_, options_).subscribe(result => {
    }, error => console.error(error));

    this.newPersonModalRef.hide();
    this.newPersonEditor = {};
  }

  showNewListModal(template: TemplateRef<any>): void {
    this.newPersonModalRef = this.modalService.show(template);
    //setTimeout(() => document.getElementById("title").focus(), 250);
  }

  changeGender(gender: string) {
    this.selectedGender = gender;
  }
}

interface IPersonDto
{
  name: string;
  startDate: Date;
  email: string;
  team: number;
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
