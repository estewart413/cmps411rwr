import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  title = 'angular-app';
  constructor(http: HttpClient){
    http.get('http://MyRestApi.com/MyRestEndpoint');
  }
}
