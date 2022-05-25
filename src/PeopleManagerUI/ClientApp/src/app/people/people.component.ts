import { Component } from '@angular/core';
import { PeopleClient, PersonDto } from '../web-api-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent {

  person: PersonDto[] = [];

  constructor(private peopleClient: PeopleClient) {
    peopleClient.get().subscribe(
      result => {
        this.person = result;
      },
      error => console.error(error)
    );
  }

}
