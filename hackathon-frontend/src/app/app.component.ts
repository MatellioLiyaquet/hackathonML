import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service';
import { Tweet } from './tweet';
import { SnotifyService } from 'ng-snotify';

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
  isDataAvailable: any;
  modelTrained: any;
  modelTrainedReason: any;


  constructor(private twitter: TwitterService, private snotifyService: SnotifyService) {
    this.tweetData = [];
    this.opened = false;
    this.incrementIndex = 1;
  }

  ngOnInit() {
    this.twitter.user().subscribe(user => this.user = user.data);
    this.getFileData();
  }

  getFileData() {
    this.loading = true;
    this.twitter.isDataAvailable().subscribe(resp => {
      if (resp.body) {
        this.loading = false;
        this.isDataAvailable = resp.body.isAvailable;
        if(this.isDataAvailable){
        }else{
          this.snotifyService.error("File Not Available");
        }
      }
    })
  }

  setValue(tweet) {
    this.loading = true;
    const req = {
      tweet: tweet
    }

    this.twitter.getTweetSentiment(req).subscribe(resp => {
      console.log(resp);
      if (resp.body) {
        this.result = resp.body[0];
      } else {
        this.result = "Cannot Analayze"
      }

      this.loading = false;
      this.opened = true;
    }, err => {
      console.log(err);
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
      this.snotifyService.error('Please Upload CSV');
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
        this.snotifyService.success('Uploaded Successfully');
        this.getFileData();
      } else {
        this.snotifyService.error(resp.body.error);
        this.csvModel = null;
        this.opened1 = false;
        this.getFileData();
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
    this.snotifyService.info('Tweet Added Successfully');
  }

  trainModel() {
    this.loading = true;
    this.twitter.trainModel().subscribe(resp => {
      if (resp.body) {
        this.modelTrained = resp.body.trained;
        this.modelTrainedReason = resp.body.reason;
        this.loading = false;
        this.snotifyService.success('Training Done');
      }
    })
  }

}
