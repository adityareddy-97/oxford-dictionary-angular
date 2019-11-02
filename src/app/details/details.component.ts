import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OxfordService } from "../oxford.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  public displayInfo = false;

  public wordId;

  public definitions;

  public examples;

  public synonyms;

  public antonyms;

  public lexicalCategories;

  public audioFiles;

  public pronunciations;

  public origins;

  public title;

  public o;

  constructor(
    public oxford: OxfordService,
    private route: ActivatedRoute,  
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
     //Get the parameter from the URL
    this.route.paramMap.subscribe(params => {
      //console.log(params);
      this.spinner.show();

      this.wordId = params.get("word_id");


      
      this.oxford.getDefinition(this.wordId).subscribe(
        data => {
          console.log(data);
          this.o = data;
          this.title = this.o.word;
          this.definitions = this.getProperty(data, "definitions");
          this.examples = this.getProperty(data, "examples");
          this.lexicalCategories = this.getProperty(data, "lexicalCategory");
          //this.audioFiles = this.getProperty(data,"audioFile");
          this.pronunciations = this.getProperty(data, "pronunciations");
          this.origins = this.getProperty(data, "etymologies");
          //console.log(this.audioFiles);

          this.lexicalCategories = this.removeDuplicateObjects(
            this.lexicalCategories
          );
          this.pronunciations = this.removeDuplicateObjects(
            this.pronunciations
          );
          this.origins = this.removeDuplicateObjects(this.origins);

          if (
            this.definitions.length > 0 ||
            this.origins.length > 0 ||
            this.examples.length > 0 ||
            this.pronunciations.length > 0
          ) {
            this.displayInfo = true;
          } else {
            this.displayInfo = false;
          }

          this.spinner.hide();

          console.log(
            this.lexicalCategories,
            this.pronunciations,
            this.origins
          );
        },
        error => {
          console.log(error);
          this.displayInfo = false;
          this.title = null;
          this.definitions = null;
          this.origins = null;
          this.pronunciations = null;
          this.examples = null;
          this.lexicalCategories = null;
          this.spinner.hide();
          //const message = error.error.error;
          this.toastr.error(
            `No Definitions  ,${error.status},${error.error.error}`
          );
        }
      );

      this.oxford.getSynAndAnt(this.wordId).subscribe(
        data => {
          // console.log(data);
          this.synonyms = this.getProperty(data, "synonyms");
          this.antonyms = this.getProperty(data, "antonyms");

          this.spinner.hide();
          console.log(this.synonyms, this.antonyms);
        },
        error => {
          console.log(error);
          this.synonyms = null;
          this.antonyms = null;
          this.spinner.hide();
          this.toastr.error(
            `No synonyms or antonyms,${error.status},${error.error.error}`
          );
        }
      );
    });
  }


  //Function to recursively obtain required data from response data 
  getProperty(object, targetProp) {
    let results = [];
    if (object instanceof Array) {
      for (let i = 0; i < object.length; i++) {
        let arrayElem = object[i];
        if (arrayElem instanceof Object || arrayElem instanceof Array) {
          results = results.concat(this.getProperty(arrayElem, targetProp));
        }
      }
    } else {
      for (let prop in object) {
        let objProp = object[prop];
        if (prop == targetProp) {
          return object[prop];
        }

        if (objProp instanceof Object || objProp instanceof Array) {
          results = results.concat(this.getProperty(objProp, targetProp));
        }
      }
    }

    return results;
  }


  //Function to remove duplicates
  removeDuplicateObjects(array: any[]) {
    return [...new Set(array.map(s => JSON.stringify(s)))].map(s =>
      JSON.parse(s)
    );
  }


  //Function to play audio of pronunciations
  play(audio) {
    audio.play();
  }
}
