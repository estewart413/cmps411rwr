import { Component, OnInit } from '@angular/core';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public localApiResponse: Quiz[];
  constructor(private http: HttpClient){
    this.localApiResponse = [{id: 0, title: "", description: "", questions: [{type:"", correctanswer:"", options:[{option:""}]}]}];
    this.http.get('/quizzes').subscribe(
      apiResponse => {
        var quizzes = JSON.stringify(apiResponse);
        this.localApiResponse = JSON.parse(quizzes);
    });
  }

  ngOnInit(): void {
  }

}
