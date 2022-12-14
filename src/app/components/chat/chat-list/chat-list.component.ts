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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  providers: [DatePipe],
})
export class ChatListComponent implements OnInit {
  public activeUser: ChatUser[] = [];
  public searchedUser: ChatUser[] = [];
  public searchUserStr: string = '';
  public isSearchedUser: boolean = false;
  public chatSearch: string = '';
  public message: string = '';
  public chatDetail: any;
  public allChatUsers: ChatUser[] = [];
  public chatDetailUser: ChatUser = new ChatUser();
  public user: User = new User();
  public subscriptions: Subscription[] = [];
  public activeUserSubscription: Subscription = new Subscription();
  public manualScroll: boolean = false;
  public currentDate = new Date();
  constructor(
    private chatService: ChatService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.activeUserSubscription = this.subscribeToActiveUser();
    this.subscriptions = [this.subscribeToUser()];
    this.getAllActiveUserList();
    this.getAllChatUsers();
    document
      .getElementsByClassName('main-content')[0]
      .classList.add('chat-main-content');
  }

  getAllChatUsers(): void {
    this.chatService.getSearchUser().subscribe((res) => {
      if (res && res.succeeded) {
        this.allChatUsers = res.data;
      }
    });
  }

  onIntersection(
    {
      target,
      visible,
    }: {
      target: Element;
      visible: boolean;
    },
    id: number
  ): void {
    if (visible && this.manualScroll)
      this.getChat(this.chatDetailUser, id, false, true);
    if (!this.manualScroll) this.manualScroll = true;
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
        // this.searchUserStr = '';
        if (res.data && res.data[0]) {
          this.getChat(res.data[0], 0, true);
        }
      }
    });
  }

  searchUser(): void {
    if (!!this.searchUserStr) {
      this.isSearchedUser = true;
      const updatedUser = this.allChatUsers.filter(
        (i) =>
          i.name.toLowerCase().includes(this.searchUserStr.toLowerCase()) ||
          i.userType.toLowerCase().includes(this.searchUserStr.toLowerCase())
      );
      this.searchedUser = updatedUser;
      console.log('this.searchedUser', this.searchedUser);
    } else {
      this.getAllActiveUserList();
    }
  }

  isActiveUser(user: ChatUser): boolean {
    if (this.activeUser.find((a) => a.userId === user.userId)) {
      return true;
    }
    return false;
  }

  getLatestMsg(): HTMLElement | null {
    return document.getElementById('latestMsg');
  }

  getChat(
    user,
    lastMessageId,
    scrollToLatest: boolean = false,
    oldMsgs: boolean = false
  ): void {
    this.chatDetailUser = user;
    let lastMessageChatId = lastMessageId;
    this.chatService
      .getChat(user.userId, lastMessageChatId)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.chatSearch = '';
          this.chatDetail = [
            ...(oldMsgs ? res.data : []),
            ...(lastMessageChatId === 0 ? [] : this.chatDetail || []),
            ...(!oldMsgs ? res.data : []),
          ];
          if (
            this.chatDetail &&
            this.chatDetail.length &&
            this.chatDetail.length > 0
          ) {
            lastMessageChatId =
              this.chatDetail[this.chatDetail.length - 1].chatId;
          }
          setTimeout(() => {
            if (scrollToLatest && this.getLatestMsg()) {
              this.getLatestMsg()?.scrollIntoView();
            }
          }, 1000);
          if (this.subscriptions.length === 2) {
            this.subscriptions[1].unsubscribe();
            this.subscriptions.pop();
          }

          this.subscriptions.push(
            this.getLatestChatByUserId(
              this.chatDetailUser.userId,
              lastMessageChatId,
              scrollToLatest
            )
          );
        }
      });
  }

  todayDate(date): boolean {
    const chatDate = new Date(date);
    if (
      this.datePipe.transform(chatDate, 'yyyy-MM-dd') ===
      this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
    ) {
      return true;
    }
    return false;
  }

  clearChatSearch(): void {
    this.chatSearch = '';
    this.getChat(this.chatDetailUser, 0, true);
  }

  clearUserSearch(): void {
    this.searchUserStr = '';
    this.isSearchedUser = false;
    this.getAllActiveUserList();
  }

  getLatestChatByUserId(
    userId,
    lastMessageChatId,
    scrollToLatest: boolean = false
  ): Subscription {
    let lastMessageId = lastMessageChatId;
    return timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.chatService.getLastestChatByUserId(userId, lastMessageId)
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
          this.chatDetail = [...(this.chatDetail || []), ...res.data];
          if (
            this.chatDetail &&
            this.chatDetail.length &&
            this.chatDetail.length > 0
          ) {
            lastMessageId = this.chatDetail[this.chatDetail.length - 1].chatId;
          }
          setTimeout(() => {
            if (scrollToLatest && this.getLatestMsg()) {
              this.getLatestMsg()?.scrollIntoView();
            }
          }, 1000);
        }
      });
  }

  addChat(): void {
    if (this.message.trim()) {
      const data = {
        SelecteUserId: this.chatDetailUser.userId,
        ChatText: this.message,
      };
      this.chatService.sendChat(data).subscribe((res) => {
        if (res && res.succeeded) {
          this.getAllActiveUserList();
          this.message = '';
        }
      });
    }
  }

  addUser(id): void {
    this.chatService.addUserToChat(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.chatSearch = '';
        this.searchUserStr = '';
        this.getAllActiveUserList();
      }
    });
  }

  activeUserChat(user: ChatUser): void {
    this.searchedUser = [];
    this.isSearchedUser = false;
    this.searchUserStr = '';
    this.getChat(user, 0, true);
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
      data: this.chatDetailUser.userId,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getAllActiveUserList();
        this.message = '';
      }
      return;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
    this.activeUserSubscription.unsubscribe();
    document
      .getElementsByClassName('main-content')[0]
      .classList.remove('chat-main-content');
  }
}
