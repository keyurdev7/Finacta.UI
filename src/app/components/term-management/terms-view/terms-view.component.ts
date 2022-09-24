import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/internal/Observable';
import { Term } from 'src/app/models/term.model';
import { TermService } from 'src/app/shared/services/term.service';

@Component({
  selector: 'app-terms-view',
  templateUrl: './terms-view.component.html',
  styleUrls: ['./terms-view.component.scss']
})
export class TermsViewComponent implements OnInit {
  termDataSource : any;
  displayedColumns: string[] = ['terms'];
  constructor(
    private termService : TermService
  ) { 
  }

  ngOnInit(): void {
    this.getTerms();
  }

  getTerms(){
    this.termService.getAllTerms().subscribe((res)=>{
      this.termDataSource = res.data;
    })
  }
}
