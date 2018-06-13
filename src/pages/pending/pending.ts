import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDBProvider } from './../../providers/userdb/userdb';
import { OnHttpResponse } from './../../interfaces/onHttpResponse';
import { RestClientProvider } from './../../providers/rest-client/restClient';
import { Book } from '../../model/book';

@IonicPage()
@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html',
})
export class PendingPage implements OnHttpResponse {

  //region PUBLIC_VARIABLES
  public books: Book[]
  //endregion PUBLIC_VARIABLES

  //region CONSTRUCTOR
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userdb: UserDBProvider,
    public rjs: RestClientProvider,) {
    this.starter()
  }
  //endregion CONSTRUCTOR

  //region ONHTTPRESPONSE
  onDataReceived(data) {
    var result = data.result
    console.log(result);

    if (result.auth) {
      this.userdb.modifyUserToken(result.t)
      this.books = result.books

    } else {
      this.userdb.getUser()
        .then(value => {
          var basic = btoa(value.email + ":" + value.pass)
          this.rjs.doRequest("POST", "books/readings",
            "Basic " + basic, this)
        })
    }
  }

  onErrorReceivingData(message: number) {
    
  }
  //endregion ONHTTPRESPONSE

  //region PRIVATE_METHODS
  private starter() {
    this.userdb.getUser()
      .then(value => {
        this.rjs.doRequest("POST", "books/readings", "Bearer " + value.token, this)
      });
  }
  //endregion PRIVATE_METHODS

}
