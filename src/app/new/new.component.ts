import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../app-quiz';
import { Questions } from '../app-questions';
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  public form:FormGroup;
  public numQuestions:number = 0;
  public numOptions:number = 0;
  public qArray:number[] = [];
  public oArray:number[] = [];
  public isLoading:boolean = true;
  payLoad =''
  constructor(private http: HttpClient, private fb: FormBuilder) { 
    this.form = this.fb.group({
      title: '',
      description:'',
      questions: this.fb.array([{
        text: '',
        type: '',
        correctanswer: '',
        options: this.fb.array([{
          option:''
        }])
      }])
    });
    this.isLoading=false;
  }

  onNumChange(event) {
    console.log("Event: ", event)
    this.numQuestions = event.srcElement.value;
    var i:number = 0;
    if(this.qArray.length !== this.numQuestions){
      var i1:number = 0;
      var length = this.qArray.length;
      for(i1=0;i1<length;i1++){
        this.qArray.pop()
      }
    }
    for(i=0;i<this.numQuestions;i++)
    this.qArray.push(i)
  }
  onOptionChange(event){
    console.log("Event: ", event)
    this.numOptions = event.srcElement.value;
    var i:number = 0;
    if(this.oArray.length !== this.numQuestions){
      var i1:number = 0;
      var length = this.oArray.length;
      for(i1=0;i1<length;i1++){
        this.oArray.pop()
      }
    }
    for(i=0;i<this.numQuestions;i++)
    this.oArray.push(i)
  }
  ngOnInit() {
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log(this.payLoad)
  }
}
