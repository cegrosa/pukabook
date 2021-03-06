import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Refresher } from 'ionic-angular';
import { UserDBProvider } from './../../providers/userdb/userdb';
import { OnHttpResponse } from './../../interfaces/onHttpResponse';
import { RestClientProvider } from './../../providers/rest-client/restClient';
import { Book } from '../../model/book';
import { TranslateService } from '@ngx-translate/core';
import { OnGetBooksResponse } from '../../interfaces/onGetBooksResponse';

@IonicPage()
@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html',
})
export class PendingPage implements OnHttpResponse, OnGetBooksResponse {

  //region VIEW_CHILD
  @ViewChild(Content) content: Content;
  //endregion VIEW_CHILD

  //region CONSTANTS
  private translateStrings = {
    "PENDING_TITLE": "PENDING_TITLE",
    "HOME_NO_PENDINGS_MSG": "HOME_NO_PENDINGS_MSG",
    "PEND_RLATER_NO_BOOKS": "PEND_RLATER_NO_BOOKS"
  }
  //endregion CONSTANTS

  //region PUBLIC_VARIABLES
  public books: Book[]

  public noBooks: boolean

  public title: string
  public noBooksMsg: string
  public noBooksBtn: string
  public showSBar: boolean
  public urlSearch: string
  public filter: string
  //endregion PUBLIC_VARIABLES

  //region ONHTTPRESPONSE
  onDataReceived(data) {
    var result = data.result
    if (result.auth) {
      this.userdb.modifyUserToken(result.t)
      if (result.books) {
        this.noBooks = false
        this.books = result.books
      } else {
        this.noBooks = true
      }
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

  //region ONSEARCHBOOKSRESPONSEi
  onGetBooks(books: Book[]) {
    this.books = books
  }
  //ebdregion ONSEARCHBOOKSRESPONSE

  //region CONSTRUCTOR
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userdb: UserDBProvider,
    private rjs: RestClientProvider,
    private translate: TranslateService, ) {

    this.starter()
  }
  //endregion CONSTRUCTOR

  //region PRIVATE_METHODS
  private starter() {
    this.showSBar = false
    this.filter = "name"
    this.urlSearch = "readings"

    this.translate.get(this.translateStrings.PENDING_TITLE)
      .subscribe(value => { this.title = value })

    this.translate.get(this.translateStrings.HOME_NO_PENDINGS_MSG)
      .subscribe(value => { this.noBooksMsg = value })

    this.translate.get(this.translateStrings.PEND_RLATER_NO_BOOKS)
      .subscribe(value => { this.noBooksBtn = value })


    this.getBooks()
  }

  private doRefresh(refresher: Refresher) {
    this.getBooks()
    refresher.complete();
  }
  //endregion PRIVATE_METHODS

  //region PUBLIC_METHODS
  public getBooks() {
    this.userdb.getUser()
      .then(value => {
        this.rjs.doRequest("POST", "books/readings", "Bearer " + value.token, this)
      })
  }

  public showHideSearchBar() {
    this.showSBar = !this.showSBar
    this.content.resize()
  }

  public popOut() {
    this.navCtrl.pop()
  }
  //endregion PUBLIC_METHODS

}
