import { Component, OnInit } from '@angular/core';
import { TwitterService } from './twitter.service';
import { Tweet } from './tweet';
import { SnotifyService } from 'ng-snotify';
import { AngularFireDatabase } from 'angularfire2/database';
import { forkJoin } from 'rxjs';

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
  fetchTweet: boolean;
  tweetData: any;
  opened: boolean;
  selectedText: string;
  opened1: boolean;
  isDataAvailable: any;
  modelTrained: any;
  modelTrainedReason: any;
  items: any;
  chart1: any;
  chart2: any;
  chart3: any;
  gridData: Array<any>;
  chart4: string;
  chart5: string;
  tweetSentiment: string;
  isDataVisualization: boolean;
  loadingtweets: boolean;
  allModal: boolean;


  constructor(private twitter: TwitterService, private snotifyService: SnotifyService, db: AngularFireDatabase) {
    this.tweetData = [];
    this.opened = false;
    this.gridData = [];
    db.list('tweets').valueChanges().subscribe(resp => {
      this.tweetData = resp;
      this.tweetData = this.tweetData.reverse();
      console.log(this.tweetData)
    });
  }

  ngOnInit() {
    this.getFileData();
  }

  getFileData() {
    this.loading = true;
    this.loadingtweets = true;
    this.twitter.isDataAvailable().subscribe(resp => {
      if (resp.body) {
        this.isDataAvailable = resp.body.isAvailable;
        if (this.isDataAvailable) {
          resp.body.data.forEach((element, index) => {
            if (index !== 0) {
              let sentiment = '';
              this.gridData.push({
                sentiment: element[0],
                tweet: element[1],
                sentimentText: sentiment
              })
            }
          });
          this.loading = false;
          this.loadingtweets = false;
          this.snotifyService.info("Dataset Available, Showing TOP Records");
        } else {
          this.snotifyService.info("No Dataset Available, Please Upload a Valid CSV");
          this.loading = false;
          this.loadingtweets = false;
        }
      }
    })
  }

  setValue(tweet) {
    this.loading = true;
    const req = {
      tweet: tweet
    }

    this.twitter.getTweetSentiment(tweet).subscribe((resp: any) => {
      this.result = [];
      if (resp.body) {
        this.result = resp.body.result;
        this.tweetSentiment = resp.body.sentiment;
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
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.csvFile)
    this.opened1 = false;
    this.twitter.uploadCsv(formData).subscribe((resp: any) => {
      if (resp.body.data) {
        this.csvModel = null;
        this.opened1 = false;
        this.snotifyService.success('Uploaded Successfully');
        this.getFileData();
      } else {
        this.snotifyService.error(resp.body.error);
        this.csvModel = null;
        this.opened1 = false;
      }
      this.loading = false;
    });
  }

  trainModel() {
    this.loading = true;
    this.twitter.trainModel().subscribe(resp => {
      if (resp.body) {
        this.modelTrained = resp.body.trained;
        this.modelTrainedReason = resp.body.reason;
        this.loading = false;
        if (this.modelTrained) {
          this.snotifyService.success(this.modelTrainedReason);

        } else {
          this.snotifyService.error(this.modelTrainedReason);

        }
      }
    })
  }

  visualize() {
    const bs1 = this.twitter.chart1();
    const bs2 = this.twitter.chart2();
    const bs3 = this.twitter.chart3();
    const bs4 = this.twitter.chart4();
    const bs5 = this.twitter.chart5();
    this.loading = true;
    forkJoin(bs1).subscribe((resp: any) => {
      this.chart1 = 'data:image/jpeg;base64,' + resp[0].body.data;
      this.loading = false;
    });
    forkJoin(bs2).subscribe((resp: any) => {
      this.chart2 = 'data:image/jpeg;base64,' + resp[0].body.data;
      this.loading = false;
    });
    forkJoin(bs3).subscribe((resp: any) => {
      this.chart3 = 'data:image/jpeg;base64,' + resp[0].body.data;
      this.loading = false;
    });
    forkJoin(bs4).subscribe((resp: any) => {
      this.chart4 = 'data:image/jpeg;base64,' + resp[0].body.data;
      this.loading = false;
    });
    forkJoin(bs5).subscribe((resp: any) => {
      this.chart5 = 'data:image/jpeg;base64,' + resp[0].body.data;
      this.loading = false;
    });
    this.isDataVisualization = true;
  }

  getAllAnalysis() {
    let arr = [];
    this.loading = true;
    this.tweetData.forEach(element => {
      arr.push(element.tweetText);
    });

    let request = {
      tweets: arr
    }
    this.twitter.getAllAnalysis(request).subscribe((resp: any) => {
      if (resp.body) {
        this.result = resp.body;
        this.tweetSentiment = resp.body.sentiment;
      } else {
        this.result = "Cannot Analayze"
      }
      this.loading = false;
      this.allModal = true;
    }, err => {
      console.log(err);
      this.result = err.error.text;
      this.loading = false;
      this.allModal = true;
    })
  }

}
