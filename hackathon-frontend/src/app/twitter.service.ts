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

  private API_URL = 'http://192.168.200.110:3000/api/';
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
    return this.http.post(this.API_URL + 'name', tweet, { observe: 'response' });
  }

  uploadCsv(data){
    return this.http.post(this.API_URL + 'upload-csv', data, { observe: 'response' });
  }
}
