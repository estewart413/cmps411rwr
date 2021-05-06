import {Questions} from './app-questions';
export interface Quiz {
    _id: String;
    title: String;
    description: String;
    questions: Questions[];
}