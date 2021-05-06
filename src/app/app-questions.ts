import {Options} from './app-options'
export interface Questions {
    text:string;
    type:string;
    correctanswer:string;
    options:Options[];
}