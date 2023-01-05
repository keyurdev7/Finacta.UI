import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuditLogList } from 'src/app/models/audit-log-list.model';
import { File } from 'src/app/models/file.model';
import { FileManagementService } from 'src/app/shared/services/file-management.service';
import * as commonConstants from 'src/app/shared/constants/common.constant';

@Component({
  selector: 'app-audit-log-modal',
  templateUrl: './audit-log-modal.component.html',
  styleUrls: ['./audit-log-modal.component.scss'],
})
export class AuditLogModalComponent implements OnInit {
  auditLogDataSource: MatTableDataSource<AuditLogList> =
    new MatTableDataSource<AuditLogList>();
  displayedColumns: string[] = ['actionBy', 'actionDateTime', 'actionName'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public constants = commonConstants;
  constructor(
    @Inject(MAT_DIALOG_DATA) public fileData: File,
    public dialogRef: MatDialogRef<AuditLogModalComponent>,
    private fileManagementService: FileManagementService
  ) {}

  ngOnInit(): void {
    this.fileManagementService
      .auditLog(this.fileData.recordId)
      .subscribe((res) => {
        this.auditLogDataSource.data = res.data;
      });
  }

  ngAfterViewInit() {
    this.auditLogDataSource.paginator = this.paginator;
    this.auditLogDataSource.sort = this.sort;
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
