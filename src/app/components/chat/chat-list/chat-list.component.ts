import { Component, OnInit } from '@angular/core';
import { ChatUser } from 'src/app/models/chat-user.model';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { AppState, userSelector } from 'src/app/store/app.state';
import { Subscription } from 'rxjs';
import { AddFileComponent } from '../add-chat-file/add-file.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  public activeUser: ChatUser[] = [];
  public searchedUser: ChatUser[] = [];
  public searchUserStr: string = '';
  public chatSearch: string = '';
  public message: string = '';
  public chatDetail: any;
  public chatDetailUser: ChatUser = new ChatUser();
  public user: User = new User();
  public subscriptions: Subscription[] = [];
  constructor(
    private chatService: ChatService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.getAllActiveUserList();
    this.subscriptions = [this.subscribeToUser()];
  }

  subscribeToUser(): Subscription {
    return this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
    });
  }

  getAllActiveUserList(): void {
    this.chatService.getAllActiveUser().subscribe((res) => {
      if (res && res.succeeded) {
        this.activeUser = res.data;
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
        this.chatDetail = res.data;
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
        this.getChat(id, 0);
      }
    });
  }

  searchInChat(): void {

  }
  addAttachment(): void {
    const dialog = this.dialog.open(AddFileComponent, {
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
  }
}
