import { Component, OnInit } from '@angular/core';
import { ChatUser } from 'src/app/models/chat-user.model';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  public activeUser: ChatUser[] = [];
  public searchUserStr: string = '';
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getAllActiveUserList();
  }

  getAllActiveUserList(): void {
    this.chatService.getAllActiveUser().subscribe((res) => {
      if (res && res.succeeded) {
        this.activeUser = res.data;
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
          this.activeUser = updatedUser;
        }
      });
    } else {
      this.getAllActiveUserList();
    }
  }
}
