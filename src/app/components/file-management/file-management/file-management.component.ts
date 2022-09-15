import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { File } from 'src/app/models/file.model';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import { AddFolderModalComponent } from '../add-folder-modal/add-folder-modal.component';
import { DeleteFolderModalComponent } from '../delete-folder-modal/delete-folder-modal.component';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.scss'],
})
export class FileManagementComponent implements OnInit {
  public data: File[] = [];
  currentFolderId: number = 0;
  title: string = 'File Management';
  homeLink: object = { title: 'Home', link: '/' };
  fileLink: object = { title: this.title, link: '/file-management' };
  breadCrumb: object[] = [this.homeLink];
  currentActiveItem: string = '';
  constructor(
    private dialog: MatDialog,
    private fileManagementService: FileManagementService,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(id: number = 0): void {
    this.currentFolderId = id;
    if (id === 0) {
      this.currentActiveItem = this.title;
      this.breadCrumb = [this.homeLink];
    } else {
      const breadData = this.data.find((eachData) => eachData.recordId === id);
      if (breadData) {
        this.currentActiveItem = breadData.recordName;
      } else {
        this.currentActiveItem = this.title;
      }
      this.fileManagementService.getBreadcrumbData(id).subscribe((res) => {
        if (res && res.data && res.data.length) {
          this.breadCrumb = [
            this.homeLink,
            this.fileLink,
            ...res.data.map((d) => ({ title: d.folderName, link: d.folderId })),
          ];
        } else {
          this.breadCrumb = [this.homeLink, this.fileLink];
        }
      });
    }
    this.fileManagementService.getData(id).subscribe((response) => {
      this.data = response.data;
    });
  }

  addFolderModal(): void {
    const dialog = this.dialog.open(AddFolderModalComponent, {
      minWidth: '28%',
      data: this.currentFolderId,
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getData(this.currentFolderId);
      }
      return;
    });
  }

  deleteConfirmation(id: number): void {
    const dialog = this.dialog.open(DeleteFolderModalComponent, {
      minWidth: '28%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        this.delete(id);
      }
      return;
    });
  }

  delete(id: number): void {
    this.fileManagementService.delete(id).subscribe((res) => {
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
}
