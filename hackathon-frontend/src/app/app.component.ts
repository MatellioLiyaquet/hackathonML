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
  items: any;
  chart1: any;
  chart2: any;
  gridData: Array<any>;


  constructor(private twitter: TwitterService, private snotifyService: SnotifyService, db: AngularFireDatabase) {
    this.tweetData = [];
    this.opened = false;
    this.incrementIndex = 1;
    this.gridData = [];
    db.list('tweets').valueChanges().subscribe(resp => {
      this.tweetData = resp;
      console.log(this.tweetData)
    });
  }

  ngOnInit() {
    // this.twitter.user().subscribe(user => this.user = user.data);
    this.getFileData();
  }

  getFileData() {
    this.loading = true;
    this.twitter.isDataAvailable().subscribe(resp => {
      if (resp.body) {
        
        this.isDataAvailable = resp.body.isAvailable;
        if (this.isDataAvailable) {
          resp.body.data.forEach((element, index) => {
            if (index !== 0) {
              let sentiment = '';
              switch (element[0]) {
                case '5':
                  sentiment = 'POSITIVE'
                  break;
                case '1':
                  sentiment = 'NUETRAL'
                  break;
                case '3':
                  sentiment = 'NEGETIVE'
                  break;
              }
              this.gridData.push({
                sentiment: element[0],
                tweet: element[1],
                sentimentText:sentiment
              })
            }
          });
          const bs1 = this.twitter.chart1();
          const bs2 = this.twitter.chart2();
          forkJoin(bs1).subscribe((resp: any) => {
            this.chart1 = 'data:image/jpeg;base64,'+ resp[0].body.data;
          });

          forkJoin(bs2).subscribe((resp: any) => {
            this.chart2 = 'data:image/jpeg;base64,'+ resp[0].body.data;
            this.loading = false;
          });
          console.log(this.gridData);


        } else {
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
    const req = {
      tweetId: this.incrementIndex++,
      tweetText: tweet,
      tweetSentiment: ''
    };
    this.tweet = null;
    this.twitter.addTweet(req).subscribe(resp => {
      this.snotifyService.info('Tweet Added Successfully');
    })
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
