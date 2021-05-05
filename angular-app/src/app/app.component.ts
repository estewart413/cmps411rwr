import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  title = 'angular-app';
  public localApiResponse: Object;
  constructor(private http: HttpClient){
    this.localApiResponse = '';
    this.http.get('/quizzes').subscribe(
      apiResponse => {
        this.localApiResponse = JSON.stringify(apiResponse);

        console.log(apiResponse);
    });
  }

}
