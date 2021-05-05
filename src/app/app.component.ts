import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface Quiz {
  id: Number;
  title: String;
  description: String;
  questions: [Questions]
  
}
interface Questions {
    type:String;
    correctanswer:String;
    options:[Options]
}
interface Options {
  option: Object;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  title = 'angular-app';
  public localApiResponse: Quiz[];
  constructor(private http: HttpClient){
    this.localApiResponse = [{id: 0, title: "", description: "", questions: [{type:"", correctanswer:"", options:[{option:""}]}]}];
    this.http.get('/quizzes').subscribe(
      apiResponse => {
        var quizzes = JSON.stringify(apiResponse);
        this.localApiResponse = JSON.parse(quizzes);
    });
  }


}
