import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../app-quiz';
import { Questions } from '../app-questions';
import { Options } from '../app-options';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  private id: String = "";
  public localApiResponse: Quiz;
  public questions: Questions[];
  public options: Options[];
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.localApiResponse = {_id: "", title: "", description: "", questions: [{type:"", correctanswer:"", options:[{option:""}]}]};
    this.questions = [];
    this.options = [];
    var idCheck = this.route.snapshot.paramMap.get('id');
    this.id= idCheck !== null ? idCheck : "";
      this.http.get(`/quiz/${this.id}`).subscribe(
        apiResponse => {
          var quiz = JSON.stringify(apiResponse);
          this.localApiResponse = JSON.parse(quiz);
          console.log(this.localApiResponse);
          var tmp = JSON.stringify(this.localApiResponse.questions);
          console.log(tmp);
          this.questions = JSON.parse(tmp);
          console.log(this.questions);
      });
    
   }

    ngOnInit() {
      var idCheck = this.route.snapshot.paramMap.get('id');
      this.id= idCheck !== null ? idCheck : "";
    }
    ngOnDestroy() {
    }
  }
