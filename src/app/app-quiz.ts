import {Questions} from './app-questions';
export interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: Questions[];
}