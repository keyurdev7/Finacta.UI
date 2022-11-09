import { Component, OnInit } from '@angular/core';
import { ChatUser } from 'src/app/models/chat-user.model';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { AppState, userSelector } from 'src/app/store/app.state';
import { Subscription, timer } from 'rxjs';
// import { AddFileComponent } from '../add-chat-file/add-file.component';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { AddChatFileComponent } from '../add-chat-file/add-chat-file.component';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  public activeUser: ChatUser[] = [];
  public searchedUser: ChatUser[] = [];
  public searchUserStr: string = '';
  public isSearchedUser: boolean = false;
  public chatSearch: string = '';
  public message: string = '';
  public chatDetail: any;
  public chatDetailUser: ChatUser = new ChatUser();
  public user: User = new User();
  public subscriptions: Subscription[] = [];
  public activeUserSubscription: Subscription = new Subscription();
  constructor(
    private chatService: ChatService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.activeUserSubscription = this.subscribeToActiveUser();
    this.subscriptions = [this.subscribeToUser()];
    this.getAllActiveUserList();
  }

  subscribeToUser(): Subscription {
    return this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
  }

  subscribeToActiveUser(): Subscription {
    this.activeUserSubscription.unsubscribe();
    return timer(0, 5000)
      .pipe(switchMap(() => this.chatService.getAllActiveUser(true)))
      .subscribe((res) => {
        if (res && res.succeeded && res.data && res.data[0]) {
          this.activeUser = res.data;
        }
      });
  }

  getAllActiveUserList(): void {
    this.chatService.getAllActiveUser(false).subscribe((res) => {
      if (res && res.succeeded) {
        this.activeUser = res.data;
        this.isSearchedUser = false;
        this.searchedUser = [];
        this.searchUserStr = '';
        if (res.data && res.data[0]) {
          this.getChat(res.data[0], 0);
        }
      }
    });
  }

  searchUser(): void {
    if (!!this.searchUserStr) {
      this.chatService.getSearchUser().subscribe((res) => {
        if (res && res.succeeded) {
          this.isSearchedUser = true;
          const updatedUser = res.data.filter(
            (i) =>
              !this.activeUser.some((e) => e.userId === i.userId) &&
              i.name.toLowerCase().includes(this.searchUserStr.toLowerCase())
          );
          this.searchedUser = updatedUser;
        }
      });
    } else {
      this.getAllActiveUserList();
    }
  }

  getChat(user, lastMessageId): void {
    this.chatDetailUser = user;
    this.chatService.getChat(user.userId, lastMessageId).subscribe((res) => {
      if (res && res.succeeded) {
        this.chatSearch = '';
        this.chatDetail = res.data;
        let lastMessageId = 0;
        if (
          this.chatDetail &&
          this.chatDetail.length &&
          this.chatDetail.length > 0
        ) {
          lastMessageId = this.chatDetail[this.chatDetail.length - 1].chatId;
        }
        if (this.subscriptions.length === 2) {
          this.subscriptions[1].unsubscribe();
        }

        this.subscriptions.push(
          this.getLatestChatByUserId(this.chatDetailUser.userId, lastMessageId)
        );
      }
    });
  }

  getLatestChatByUserId(userId, lastMessageChatId): Subscription {
    return timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.chatService.getLastestChatByUserId(userId, lastMessageChatId)
        )
      )
      .subscribe((res) => {
        if (
          res &&
          res.succeeded &&
          res.data &&
          res.data.length &&
          res.data.length > 0
        ) {
          this.chatDetail.push(res.data);
        }
      });
  }

  addChat(): void {
    this.chatService
      .sendChat(this.chatDetailUser.userId, this.message)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.getChat(this.chatDetailUser, 0);
          this.message = '';
        }
      });
  }

  addUser(id): void {
    this.chatService.addUserToChat(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.chatSearch = '';
        this.getAllActiveUserList();
      }
    });
  }

  searchInChat(): void {
    this.chatService
      .searchInChat(this.chatDetailUser.userId, this.chatSearch)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.chatDetail = res.data;
        }
      });
  }
  addAttachment(): void {
    const dialog = this.dialog.open(AddChatFileComponent, {
      minWidth: '50%',
      // data: this.currentFolderId,
    });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result?.event === 'success') {
    //     this.breadCrumb.push({
    //       title: this.currentActiveItem,
    //       link: this.currentFolderId,
    //     });
    //     this.getData(this.currentFolderId);
    //   }
    //   return;
    // });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
    this.activeUserSubscription.unsubscribe();
  }
}
