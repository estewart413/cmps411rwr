import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider'
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
@NgModule({
    imports: [
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatRadioModule,
        MatSelectModule,
        MatListModule,
        MatSnackBarModule
    ],
    exports: [
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatRadioModule,
        MatSelectModule,
        MatListModule,
        MatSnackBarModule
    ]
})
export class MaterialModule {}