import { Component, OnInit } from '@angular/core';
import { Invoice } from 'src/app/models/invoice.model';
import { APIService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns: string[] = [
    'invoiceNumber',
    'invoiceStatus',
    'invoiceAmount',
    'view',
    // 'action',
  ];
  statusStages: any = {
    paid: 'success',
    unpaid: 'danger',
    overdue: 'warning',
  };
  constructor(private api: APIService) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices(): void {
    this.api.getInvoices().subscribe((res) => {
      this.invoices = res.data;
    });
  }
}
