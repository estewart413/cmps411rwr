import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
//Initialize Values
export class NewComponent implements OnInit {
  public form: FormGroup;
  public numQuestions: number = 0;
  public numOptions: number = 0;
  public qArray: number[] = [];
  public oArray: number[] = [];
  public isLoading: boolean = true;
  public isLoadingQ: boolean = true;
  public types = [
    {value: 'multiplechoicesingle', name: "Multiple Choice - Single Answer"},
    {value: 'multiplechoicemultiple', name: "Multiple Choice - Multiple Answers"},
    {value: 'shortanswer', name: "Short Answer"},
    {value: 'truefalse', name: "True/False"}
  ];
  public type: string = '';
  public option: string='';
  payLoad = '';
  constructor(private http: HttpClient, private fb: FormBuilder, private sb: MatSnackBar) {
    this.form = this.fb.group({
      _id: '',
      title: '',
      description: '',
      questions: this.fb.array([]),
    });
    this.isLoading = false;
  }
  //Getters for the different components of the form.
  //Entry has to be direclty typed to FormArray or FormGroup or else it will return as AbstractControl
  //AbstractControl cannot have values retrieved from it
  getQuestions() {
    return this.form.get('questions') as FormArray;
  }
  getQuestionsControls(i:number) {
    return this.getQuestions().controls[i] as FormGroup;
  }
  getOptions(i:number) {
    return this.getQuestionsControls(i).get('options') as FormArray;
  }
  getOptionsControls(i:number,j:number) {
    return this.getOptions(i).controls[j] as FormGroup;
  }
  //When number of questions is changed, add/remove questions to questions array
  onNumChange(event) {
    this.numQuestions = event.srcElement.value;
    this.isLoadingQ = true;
    var array = this.getQuestions();
    if (array.length > this.numQuestions) {
      var i: number = array.length;
      for (i; i >= this.numQuestions; i--) {
        array.removeAt(i);
      }
    } else if (array.length < this.numQuestions) {
      var i: number = this.numQuestions-1;
      for (i; i < this.numQuestions; i++) {
        array.push(
          this.fb.group({
            text: '',
            type: '',
            correctanswer: '',
            options: this.fb.array([]),
          })
        );
      }
      
    }
    this.isLoadingQ = false;
  }
  //When number of options is changed, add/remove options from options array
  onOptionChange(event, id) {
    var numOptions = event.srcElement.value;
    var array = this.getOptions(id);
    if (array.length > numOptions) {
      var x: number = array.length;
      for (x; x >= numOptions; x--) {
        array.removeAt(x);
      }
    } else if (array.length < numOptions) {
      var x: number = numOptions-1;
      for (x; x < numOptions; x++) {
        array.push(
          this.fb.group({
            option: ''
          })
        );
      }  
    }
  }
  //Value on option was not changing so had to manually patch
  onOptionValueChange(event, i, j) {
    console.log(event)
    this.option = event.srcElement.value;
    this.getOptionsControls(i,j).get('option').patchValue(this.option);
  }
  //Value on type was not saving so had to manually patch
  onTypeChange(event, id) {
    this.type = event.value;
    this.getQuestionsControls(id).get('type').patchValue(this.type);
    if (this.type === 'shortanswer' || this.type === 'truefalse' && this.numOptions > 0){
      this.getOptions(id).clear();
    }
  }
  ngOnInit() {}
  //Since form is pre-formatted, directly post
  onSubmit() {
    this.payLoad = this.form.getRawValue()
    this.http.post('/new', this.payLoad, { headers:
      {"Content-Type": "application/json"}
    }).subscribe(response => {
      console.log(response);
      this.sb.open("Quiz posted successfully!", "Ok");
    })
  }
}
