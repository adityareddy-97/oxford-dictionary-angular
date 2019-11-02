import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";

const headers = new HttpHeaders()
  .append("Accept", "application/json")
  .append("app_id", "6b619c1c")
  .append("app_key", "61580df259c45597b122ec6fff31e9e5");

@Injectable({
  providedIn: "root"
})
export class OxfordService {
  constructor(public http: HttpClient) {}

  //public baseUrl = 'https://od-api.oxforddictionaries.com/api/v2/';

  //Service to get definitions,etymology,pronunciations,examples
  getDefinition(word: string) {
    return this.http.get(`/api/entries/en-gb/${word}?strictMatch=true`, {
      headers
    });
  }

  //Service to get search item list on autocomplete
  onSearch(word: string) {
    return this.http.get(`/api/search/en-gb?q=${word}&prefix=true&limit=10`, {
      headers
    });
  }

  //Service to get synonyms and antonyms
  getSynAndAnt(word: string) {
    return this.http.get(`/api/thesaurus/en/${word}?strictMatch=true`, {
      headers
    });
  }

  private handleError(err: HttpErrorResponse) {
    console.log("Handle http error calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
