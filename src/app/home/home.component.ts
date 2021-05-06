import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../app-quiz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public localApiResponse: Quiz[];
  constructor(private http: HttpClient, private router: Router){
    this.localApiResponse = [{_id: "", title: "", description: "", questions: [{type:"", correctanswer:"", options:[{option:""}]}]}];
    this.http.get('/quizzes').subscribe(
      apiResponse => {
        var quizzes = JSON.stringify(apiResponse);
        this.localApiResponse = JSON.parse(quizzes);
    });
  }
  goToSubmit(id:String) {
    this.router.navigate(['../submit', id]);
  }

  ngOnInit(){
  }

}
