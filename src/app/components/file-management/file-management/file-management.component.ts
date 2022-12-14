import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { File } from 'src/app/models/file.model';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { AddFolderModalComponent } from '../add-folder-modal/add-folder-modal.component';
import { AddFileComponent } from '../add-file/add-file.component';
import { DeleteFolderModalComponent } from '../delete-folder-modal/delete-folder-modal.component';
import * as commonConstants from 'src/app/shared/constants/common.constant';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  AppState,
  companiesSelector,
  userSelector,
} from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';
import {
  SetCompaniesAction,
  UpdateUserAction,
} from 'src/app/store/app.actions';
import { CopyToCustomerModalComponent } from '../copy-to-customer-modal/copy-to-customer-modal.component';
import { DocPreviewModalComponent } from '../doc-preview-modal/doc-preview-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AuditLogModalComponent } from '../audit-log-modal/audit-log-modal.component';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit, OnDestroy {
  public envVar = environment;
  public isListView: boolean = true;
  public constants = commonConstants;
  public subscriptions: Subscription[] = [];
  public data: File[] = [];
  public user: User = new User();
  searchStr: string = '';
  searched: boolean = false;
  currentFolderId: number = 0;
  title: string = 'File Management';
  homeLink: any = { title: 'Home', link: '/', isRouterLink: true };
  fileLink: any = {
    title: this.title,
    link: 0,
    isRouterLink: false,
  };
  breadCrumb: any[] = [this.homeLink];
  currentActiveItem: string = '';
  fileTypes: any = {
    pdf: ['pdf'],
    word: ['doc', 'docx'],
    excel: ['xls', 'xlsx'],
    image: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'wav'],
    video: ['mp4', 'flv', 'mkv', 'mov'],
    commonFile: 'file',
    folder: 'folder',
  };
  displayedColumns: string[] = [
    'isAcknowledged',
    'recordName',
    'createdDateTime',
    'recordType',
    'fileSize',
    'documentStatus',
    'createdBy',
    'acknowledgedBy',
    'approvedBy',
    'action',
  ];
  companiesData: any;
  fileDataSource: MatTableDataSource<File> = new MatTableDataSource<File>();
  // Need to use setter function as we have used *ngIf in parents of mat table
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.fileDataSource.sort = sort;
  }
  constructor(
    private dialog: MatDialog,
    private fileManagementService: FileManagementService,
    private toster: ToastrService,
    private chatService: ChatService,
    public store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.getData();
    this.subscriptions = [
      this.subscribeToUser(),
      this.subscribeToSidebarCount(),
    ];
  }

  subscribeToSidebarCount(): Subscription {
    return this.store.pipe(companiesSelector).subscribe((res) => {
      this.companiesData = res;
    });
  }

  changeView(mode: boolean): void {
    this.store.dispatch(
      UpdateUserAction(
        Object.assign({}, this.user, {
          fileManagementListView: mode,
        })
      )
    );
  }

  acknowledgeSet(file: File): void {
    this.fileManagementService
      .setAcknowledgeValue(file.recordId)
      .subscribe((res) => {
        if (res && res.succeeded) {
          this.chatService.getUnReadMessageCount().subscribe((res) => {
            console.log(res);
            this.store.dispatch(SetCompaniesAction(res.data));
          });
          // if (
          //   this.companiesData?.objNotificationCount?.unacknowledgedCount > 0
          // ) {
          //   this.store.dispatch(
          //     SetCompaniesAction(
          //       Object.assign({}, this.companiesData, {
          //         objNotificationCount: {
          //           ...this.companiesData.objNotificationCount,
          //           unacknowledgedCount:
          //             this.companiesData.objNotificationCount
          //               .unacknowledgedCount - 1,
          //         },
          //       })
          //     )
          //   );
          // }

          this.toster.success(res.message);
          this.getData(this.currentFolderId);
        } else if (res && res.errors.length) {
          res.errors.forEach((err) => {
            this.toster.error(err.errorMessage);
          });
        } else if (res && !res.succeeded && res.data) {
          this.toster.error(res.data);
        }
      });
  }

  subscribeToUser(): Subscription {
    return this.store.pipe(userSelector).subscribe((res) => {
      this.user = res;
      this.isListView =
        this.user.fileManagementListView === false ? false : true;
    });
  }

  getFileImage(name: string, type: string): string {
    const ext = name.split('.').reverse()[0];
    let ret =
      type === this.constants.FOLDER_TYPE
        ? this.fileTypes.folder
        : this.fileTypes.commonFile;
    if (ext && type === this.constants.FILE_TYPE) {
      Object.keys(this.fileTypes).forEach((key) => {
        if (
          Array.isArray(this.fileTypes[key]) &&
          this.fileTypes[key].includes(ext)
        ) {
          ret = key;
        }
      });
    }
    ret =
      this.isListView && ret === this.fileTypes.commonFile
        ? 'o'
        : this.isListView && ret !== this.fileTypes.folder
        ? ret + '-o'
        : ret;
    return ret;
  }

  getExt(type): string {
    const ext = type.split('.').reverse()[0];
    return ext;
  }

  openAuditLog(file: File): void {
    const dialog = this.dialog.open(AuditLogModalComponent, {
      minWidth: '28%',
      data: file,
    });
  }

  getData(id: number = 0, fromClear: boolean = false): void {
    this.currentFolderId = id;
    if (id === 0) {
      this.currentActiveItem = this.title;
      this.breadCrumb = [this.homeLink];
      this.fileManagementService.getData(id).subscribe((response) => {
        this.data = response.data;
        this.fileDataSource.data = response.data;
      });
    } else {
      const activeItem = this.data.find(
        (eachData) =>
          eachData.recordId === id &&
          eachData.recordType === this.constants.FOLDER_TYPE
      );
      const activeCrumb = this.breadCrumb.find(
        (eachData) => eachData.link === id
      );
      if (activeItem) {
        this.currentActiveItem = activeItem.recordName;
      } else if (activeCrumb) {
        this.currentActiveItem = activeCrumb.title;
      } else {
        this.currentActiveItem = fromClear
          ? this.currentActiveItem
          : this.title;
      }
      this.fileManagementService.getBreadcrumbData(id).subscribe((res) => {
        if (res && res.data && res.data.length) {
          this.breadCrumb = [
            this.homeLink,
            this.fileLink,
            ...res.data.map((d) => ({
              title: d.folderName,
              link: d.folderId,
              isRouterLink: false,
            })),
          ];
        } else {
          this.breadCrumb = [this.homeLink, this.fileLink];
        }
        this.fileManagementService.getData(id).subscribe((response) => {
          this.data = response.data;
          this.fileDataSource.data = response.data;
        });
      });
    }
  }

  addFolderModal(): void {
    const dialog = this.dialog.open(AddFolderModalComponent, {
      minWidth: '28%',
      data: this.currentFolderId,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.breadCrumb.push({
          title: this.currentActiveItem,
          link: this.currentFolderId,
        });
        this.getData(this.currentFolderId);
      }
      return;
    });
  }

  approveDoc(file: File): void {
    this.fileManagementService.approveFile(file.recordId).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getData(this.currentFolderId);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  copyToCustomerModal(): void {
    this.fileManagementService.getActiveCompanies().subscribe((res) => {
      if (res && res.succeeded) {
        const dialog = this.dialog.open(CopyToCustomerModalComponent, {
          minWidth: '28%',
          data: res.data,
        });
      }
    });
  }

  addFileModal(): void {
    const dialog = this.dialog.open(AddFileComponent, {
      minWidth: '50%',
      data: this.currentFolderId,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.breadCrumb.push({
          title: this.currentActiveItem,
          link: this.currentFolderId,
        });
        this.getData(this.currentFolderId);
      }
      return;
    });
  }

  deleteConfirmation(file: File): void {
    const dialog = this.dialog.open(DeleteFolderModalComponent, {
      minWidth: '28%',
      data: file,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        if (file.recordType === this.constants.FOLDER_TYPE) {
          this.deleteFolder(file.recordId);
        } else {
          this.deleteFile(file.recordId);
        }
      }
      return;
    });
  }

  deleteFolder(id: number): void {
    this.fileManagementService.delete(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.breadCrumb.push({
          title: this.currentActiveItem,
          link: this.currentFolderId,
        });
        this.toster.success(res.message);
        this.getData(this.currentFolderId);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  deleteFile(id: number): void {
    this.fileManagementService.deleteFile(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.breadCrumb.push({
          title: this.currentActiveItem,
          link: this.currentFolderId,
        });
        this.toster.success(res.message);
        this.getData(this.currentFolderId);
      } else if (res && res.errors.length) {
        res.errors.forEach((err) => {
          this.toster.error(err.errorMessage);
        });
      } else if (res && !res.succeeded && res.data) {
        this.toster.error(res.data);
      }
    });
  }

  search(fromClear: boolean = false): void {
    this.searchStr = this.searchStr.trim();
    this.searched = false;
    if (this.searchStr) {
      this.searched = true;
      this.fileManagementService
        .search(this.currentFolderId, this.searchStr)
        .subscribe((res) => {
          if (res && res.succeeded) {
            this.data = res.data;
            this.fileDataSource.data = res.data;
          } else if (res && res.errors.length) {
            res.errors.forEach((err) => {
              this.toster.error(err.errorMessage);
            });
          } else if (res && !res.succeeded && res.data) {
            this.toster.error(res.data);
          }
        });
    } else {
      this.getData(this.currentFolderId, fromClear);
    }
  }

  clearSearch(): void {
    this.searchStr = '';
    if (this.searched) {
      this.search(true);
    }
  }

  rowClick(row: any): void {
    if (row.recordType === this.constants.FILE_TYPE) {
      this.openPreview(row);
    } else if (row.recordType === this.constants.FOLDER_TYPE) {
      this.getData(row.recordId);
    }
  }

  openPreview(file: File): void {
    const dialog = this.dialog.open(DocPreviewModalComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: file,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
