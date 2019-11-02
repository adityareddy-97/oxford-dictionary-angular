import { Component, OnInit } from "@angular/core";
import { OxfordService } from "../oxford.service";
import { FormControl, Form } from "@angular/forms";
import { Router } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter
} from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  constructor(
    public oxford: OxfordService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  displayList = false;

  wordList;

  queryField: FormControl = new FormControl();

  excludeBeforeClick = false;

  ngOnInit() {
    this.queryField.valueChanges
      .pipe(
        filter(query => !query || query.length > 2 || query !== ""),
        debounceTime(500),
        distinctUntilChanged(),
        filter(query => query !== ""),
        switchMap(query =>
          query.length > 2 ? this.oxford.onSearch(query) : (this.wordList = [])
        )
      )
      .subscribe(
        response => {
          this.wordList = null;
          this.displayList = true;
          this.wordList = response.results;
          console.log(this.wordList);
        },

        error => {
          this.toastr.error(
            `No search result ,${error.status},${error.error.error}`
          );
        }
      );
  }

  OnFocus(value) {
    console.log("focus ");

    if (value.length > 1) {
      this.displayList = true;
    } else {
      this.displayList = false;
    }
  }

  OnBlur() {
    console.log("blur");
    this.displayList = false;
  }

  OnClickOutside(e: Event) {
    console.log(e.type);
    this.displayList = false;
  }

  OnClick(e: Event) {
    this.queryField.setValue("");
    this.displayList = false;
  }

  btnClick(value) {
    const letters = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/;
    const reg = value.match(letters);
    if (reg === null || reg === "") {
      //alert("Enter a word");
      this.toastr.warning("Enter a word");
    } else {
      this.router.navigate(["/details", value]);
    }
  }
}
