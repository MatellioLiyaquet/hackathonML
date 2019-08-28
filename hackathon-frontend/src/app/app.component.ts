import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service';
import { Tweet } from './tweet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TwitterService]
})
export class AppComponent implements OnInit {
  user;
  tweet: string;
  result: any;
  csvFile: any;
  csvModel: any;
  csvData: any;
  loading: boolean;
  submitTweet: boolean;
  fetchTweet: boolean;
  tweetData: any;
  opened: boolean;
  selectedText: string;
  opened1: boolean;
  incrementIndex: number;


  constructor(private twitter: TwitterService) {
    this.tweetData = [];
    this.opened = false;
    this.incrementIndex = 1;
  }

  ngOnInit() {
    this.twitter.user().subscribe(user => this.user = user.data);
  }

  setValue(tweet) {
    this.loading = true;
    const req = {
      tweet: tweet
    }

    this.twitter.getTweetSentiment(req).subscribe(resp => {
      console.log(resp);
      this.result = resp;
      this.loading = false;
      this.opened = true;
    }, err => {
      this.result = err.error.text;
      this.loading = false;
      this.opened = true;
    })
  }

  uploadFile(file) {
    if (file[0].type === 'text/csv') {
      this.csvFile = file[0];
    } else {
      this.csvFile = null;
      alert('Please Upload CSV');
      return;
    }
  }


  uploadFileOnServer() {
    const formData = new FormData();
    formData.append('file', this.csvFile)
    this.twitter.uploadCsv(formData).subscribe((resp: any) => {
      if (resp.body.data) {
        // this.csvData = resp.body.data;
        this.csvModel = null;
        this.opened1 = false;
        alert('Uploaded Successfully');
      } else {
        console.log(resp.body.err);
        alert(resp.body.err);
        this.csvModel = null;
        this.opened1 = false;
      }
    });
  }

  addTweet(tweet) {
    this.tweetData.push({
      tweetId: this.incrementIndex++,
      tweetText: tweet,
      tweetSentiment: ''
    });
    this.tweet = null;
    alert('Tweet Added Successfully');
  }

}
