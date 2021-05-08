import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../app-quiz';
import { Questions } from '../app-questions';
import {QuestionBase} from './QuestionBase';
import { FormGroup, FormControl, FormBuilder,FormArray } from '@angular/forms';

interface qOptions {
  key:string,
  value:string
}
interface Answers {
  answer:string
}
@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  private id: String = '';
  public isLoading:boolean = true;
  public localApiResponse: Quiz ={
    _id: '',
    title: '',
    description: '',
    questions: [{text:"", type: '', correctanswer: '', options: [{ option: '' }] }],
  };;
  public questions: Questions[] = [];
  @Input() questionList: QuestionBase[] = [];
  form!: FormGroup;
  payLoad = '';
  multichoice:any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder,) {
  }

  mapQuestions(questions: Questions[]) {
    var id:number = 1;
    var qId:number = 1;
    questions.forEach((element) => {
      var optionList = element.options;
      var optionArray:qOptions[] = [];
      optionList.forEach((option) => {
        optionArray.push({
          key: String(id),
          value: option.option
        })
        id++;
      })
      this.questionList.push({
        key: String(qId),
        controlType:element.type,
        type:element.type,
        label:element.text,
        options: optionArray,
        required:true,
        value:element.correctanswer,
        order:1
      })
      qId++;
    })
    return this.questionList;
  }
  toFormGroup(questions: QuestionBase[] ) {
    const form:FormGroup = this.fb.group({})

    questions.forEach(question => {
      if(question.controlType === "multiplechoicemultiple"){
        form.addControl(question.key, new FormArray([]))
      } else if (question.controlType === "shortanswer"){
        form.addControl(question.key, new FormControl(''));
      } else {
        form.addControl(question.key, new FormControl(question.value || ''));
      }
    });
    return form;
  }

  ngOnInit() {
    var idCheck = this.route.snapshot.paramMap.get('id');
    this.id = idCheck !== null ? idCheck : '';
    this.http.get(`/quiz/${this.id}`).subscribe((apiResponse) => {
      var quiz = JSON.stringify(apiResponse);
      this.localApiResponse = JSON.parse(quiz);
      var tmp = JSON.stringify(this.localApiResponse.questions);
      this.questions = JSON.parse(tmp);
      this.form = this.toFormGroup(this.mapQuestions(this.questions))
      this.isLoading=false;
    });
  }
  onChange(key, event){
    const multichoice:FormArray = this.form.get(key) as FormArray;
    if(event.srcElement.previousElementSibling !== null && event.srcElement.previousElementSibling.__ngContext__[21] === "unchecked") {
      multichoice.push(this.fb.control(event.srcElement.innerText));
    } else {
      multichoice.removeAt(event.srcElement.innerText);
    }
  }
  onSubmit() {
    this.payLoad = this.form.getRawValue();
    console.log(this.payLoad)
    var answerList:Answers[] = [];
    for(const [key,value] of Object.entries(this.payLoad)){
      if(Array.isArray(value)){
        var text:string = value.join(',');
        answerList.push({answer: text})
      } else {
      answerList.push({answer: value})
      }
    }
    console.log("answers: ", answerList);
    console.log(JSON.stringify(answerList))
    this.http.post(`/quiz/${this.id}`, JSON.stringify(answerList));
  }
}
