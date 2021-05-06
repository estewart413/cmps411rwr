import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {NgSwitch} from '@angular/common/common';
import { QuestionBase } from './QuestionBase';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase;
  @Input() form!: FormGroup;
}