import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../app-quiz';
import { Questions } from '../app-questions';
import {QuestionBase} from './QuestionBase';
import { FormGroup, FormControl } from '@angular/forms';

interface qOptions {
  key:string,
  value:string
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
  constructor(private route: ActivatedRoute, private http: HttpClient) {
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
    console.log(this.questionList)
    return this.questionList;
  }
  toFormGroup(questions: QuestionBase[] ) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = new FormControl(question.value || '');
    });
    console.log(group);
    return new FormGroup(group);
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
      console.log(this.form);
      this.isLoading=false;
    });
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log(this.payLoad)
  }
}
