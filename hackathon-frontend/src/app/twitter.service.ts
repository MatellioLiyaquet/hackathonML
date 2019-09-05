import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Tweet } from './tweet';

export interface TwitterResponse {
  data: any;
  resp: any;
}

@Injectable()
export class TwitterService {

  private API_URL = 'http://13.57.238.187:3001/api/';
  constructor(private http: HttpClient) { }

  user() {
    return this.http.get<TwitterResponse>(`${environment.api}/user`);
  }

  home(since?: string) {
    return this.http.get<TwitterResponse>(`${environment.api}/home?since=${since}`);
  }

  action(property: 'favorite' | 'retweet', id: string, state: boolean) {
    return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, { state });
  }

  getTweetSentiment(tweet) {
    return this.http.post(this.API_URL + 'getSentiment', tweet, { observe: 'response' });
  }

  uploadCsv(data) {
    return this.http.post(this.API_URL + 'upload-csv', data, { observe: 'response' });
  }

  isDataAvailable(): any {
    return this.http.get<TwitterResponse>(this.API_URL + 'isTrainingDataAvailable', { observe: 'response' });
  }

  trainModel(): any {
    return this.http.get<TwitterResponse>(this.API_URL + 'trainData', { observe: 'response' });
  }

  chart1(): any {
    return this.http.get<TwitterResponse>(this.API_URL + 'chart1', { observe: 'response' });
  }

  chart2(): any {
    return this.http.get<TwitterResponse>(this.API_URL + 'chart2', { observe: 'response' });
  }

  chart3(): any {
    return this.http.get<TwitterResponse>(this.API_URL + 'chart3', { observe: 'response' });
  }

  addTweet(data): any {
    return this.http.post<TwitterResponse>('https://react-my-burger-9833c.firebaseio.com//tweets.json', data, { observe: 'response' });
  }

}
