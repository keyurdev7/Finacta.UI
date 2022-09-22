import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { AppState, userSelector } from 'src/app/store/app.state';
import { User } from 'src/app/models/user.model';
import { UpdateUserAction } from 'src/app/store/app.actions';

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
  constructor(
    private dialog: MatDialog,
    private fileManagementService: FileManagementService,
    private toster: ToastrService,
    public store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.getData();
    this.subscriptions = [this.subscribeToUser()];
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

  getData(id: number = 0): void {
    this.currentFolderId = id;
    if (id === 0) {
      this.currentActiveItem = this.title;
      this.breadCrumb = [this.homeLink];
      this.fileManagementService.getData(id).subscribe((response) => {
        this.data = response.data;
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
        this.currentActiveItem = this.title;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((eachSub) => eachSub.unsubscribe());
  }
}
