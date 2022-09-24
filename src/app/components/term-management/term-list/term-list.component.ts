import { Component, OnInit , ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Term } from 'src/app/models/term.model'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TermService } from 'src/app/shared/services/term.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, userSelector } from 'src/app/store/app.state';
import { User} from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddTermComponent } from '../add-term/add-term.component';
import { DeleteTermConfirmationComponent } from '../delete-term-confirmation/delete-term-confirmation.component';


@Component({
  selector: 'app-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.scss']
})
export class TermListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user: User = new User();
  displayedColumns: string[] = [
    'termtitle',
    // 'termcontent',
    'action',
  ];

  termDataSource: MatTableDataSource<Term> = new MatTableDataSource<Term>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private termService : TermService,
    public store: Store<AppState>,
    public dialog: MatDialog,
    public toster: ToastrService
  ) { }

  subscribeToUser() {
    this.subscriptions.push(
      this.store.pipe(userSelector).subscribe((res) => {
        this.user = res;
      })
    );
  }

  ngOnInit(): void {
    this.getTerms();
  }

  getTerms(){
    this.termService.getAllTerms().subscribe((res)=>{
      this.termDataSource.data = res.data;
    })
  }
  ngAfterViewInit() {
    debugger;
    this.termDataSource.paginator = this.paginator;
    this.termDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.termDataSource.filter = filterValue.trim().toLowerCase();
    if (this.termDataSource.paginator) {
      this.termDataSource.paginator.firstPage();
    }
  }

  addTerm():void{
    const dialog = this.dialog.open(AddTermComponent, {
      minWidth : '50%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getTerms();
      }
      if (result?.event === 'Cancel') {
        this.getTerms();
      }
      return;
    });
  }

  editTerm(id: number): void {
    const data = this.termDataSource.data.find((eachData) => eachData.termId === id);
    const dialog = this.dialog.open(AddTermComponent, {
      minWidth: '50%',
      data
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'success') {
        this.getTerms();
      }
      if (result?.event === 'Cancel') {
        this.getTerms();
      }
      return;
    });
  }

  
  deleteTermConfirmation(id: number) {
    const dialog = this.dialog.open(DeleteTermConfirmationComponent, {
      minWidth: '28%',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result?.event === 'confirm') {
        this.deleteTerm(id);
      }
      return;
    });
  }

  deleteTerm(id: number): void {
    this.termService.deleteTerm(id).subscribe((res) => {
      if (res && res.succeeded) {
        this.toster.success(res.message);
        this.getTerms();
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

