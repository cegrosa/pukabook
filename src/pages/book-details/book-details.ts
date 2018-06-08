import { OnHttpResponse } from '../../interfaces/onHttpResponse';
import { RestClientProvider } from '../../providers/rest-client/restClient';
import { UserDBProvider } from '../../providers/userdb/userdb';
import { TranslateService } from '@ngx-translate/core';
import { Author } from '../../model/author';
import { Book } from '../../model/book';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html',
})
export class BookDetailsPage implements OnHttpResponse {

  //region CONSTANTS
  private translateStrings = {
    "BOOK_DETAILS_SYNOPSIS": "BOOK_DETAILS_SYNOPSIS",
    "BOOK_DETAILS_READ": "BOOK_DETAILS_READ",
    "BOOK_DETAILS_BY": "BOOK_DETAILS_BY",
    "BOOK_DETAILS_SIMILAR": "BOOK_DETAILS_SIMILAR",
  }
  //endregion CONSTANTS

  //region PUBLIC_VARIABLES
  public book: Book
  public author: Author
  public books = []

  public synopsis: string
  public read: string
  public by: string
  public similar: string
  //endregion PUBLIC_VARIABLES

  //region ONHTTPRESPONSE
  onDataReceived(data) {
    var result = data.result
    if (result.auth) {
      this.userdb.modifyUserToken(result.t)
      this.books = result.books
    } else {
      this.userdb.getUser()
        .then(value => {
          var basic = btoa(value.email + ":" + value.pass)
          this.rjs.doRequest("POST", "books/book",
            "Basic " + basic, this, { bookcode: this.book.id })
        })
    }
  }
  onErrorReceivingData(message: number) {

  }
  //endregion ONHTTPRESPONSE

  //region CONST
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private userdb: UserDBProvider,
    private rjs: RestClientProvider) {

    this.starter()
  }
  //endregion CONST

  //region PRIVATE_METHODS
  private starter() {
    this.book = this.navParams.get('book')
    this.author = this.navParams.get('author')

    this.translate.get(this.translateStrings.BOOK_DETAILS_BY)
      .subscribe(value => { this.by = value })

    this.translate.get(this.translateStrings.BOOK_DETAILS_READ)
      .subscribe(value => { this.read = value })

    this.translate.get(this.translateStrings.BOOK_DETAILS_SIMILAR)
      .subscribe(value => { this.similar = value })

    this.translate.get(this.translateStrings.BOOK_DETAILS_SYNOPSIS)
      .subscribe(value => { this.synopsis = value })

    this.getSimilarBooks()
  }

  private getSimilarBooks() {
    this.userdb.getUser()
      .then(value => {
        this.rjs.doRequest("POST", "books/book", "Bearer " + value.token,
          this, { bookcode: this.book.id })
      })
  }
  //endregion PRIVATE_METHODS

  //region PUBLIC_METHODS

  //endregion PUBLIC_METHODS
}
