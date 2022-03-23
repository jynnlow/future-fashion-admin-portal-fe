import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import * as dto from '../dto/order';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  // Datatable related
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    destroy: true,
    paging: false,
    retrieve: true,
    searching: true,
  };
  dtTrigger: Subject<any> = new Subject<any>();

  //table content
  orders: dto.Order[] = [];
  orderDetails: dto.Cart[] = [];
  order: dto.Order = {
    id: 0,
    userID: 0,
    total: 0,
    status: '',
    snapshots: this.orderDetails,
    createdAt: new Date()
  }
  userInfo: dto.UserInfo = {
    id: 0,
    username: '',
    password: '',
    role: '',
    dob: '',
    chest: 0,
    waist: 0,
    hip: 0,
  }

  // modal content
  modalRef?: BsModalRef;
  @ViewChild('orderModal') orderModal: TemplateRef<any> = <TemplateRef<any>>{};

  constructor(
    private http: HttpService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadOrders()
  }

  async loadOrders(){
    this.http.getOrders().subscribe({
      next: (data) => {
        if(data.status !== 'SUCCESS') {
          Swal.fire('Error', data.message, 'error');
          return;
        }
        this.orders = data.details.orders;
        
        this.dtTrigger.next(null);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    })
  }

  loadOrderDetails(id: number){
    this.orderDetails = [];
    let foundOrder = this.orders.find(order => order.id === id);
    if(foundOrder){
      this.order = foundOrder
      this.orderDetails = foundOrder.snapshots
      return
    }
  }

  loadUserInfo(id: number){
    this.http.getUserInfo(id).subscribe({
      next: (data) => {
        if(data.status !== 'SUCCESS') {
          Swal.fire('Error', data.message, 'error');
          return;
        }
        this.userInfo = data.details        
        this.dtTrigger.next(null);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    })
  }

  openOrderModal(id: number){
    this.loadOrderDetails(id);
    this.loadUserInfo(this.order.userID);
    this.modalRef = this.modalService.show(this.orderModal);
    this.modalRef.setClass('modal-xl');
  }

  async editOrderStatus(){
    const confirmRes = await Swal.fire({
      title: 'Edit Order',
      text: 'Confirm edit order?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.updateOrderDetails(this.order).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', data['message'], 'error');
          }else{
            Swal.fire('Success', `order edited successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', err, 'error')
        }
      })
    }
  }

  rerender() {
    this.loadOrders();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next(null);
    });
  }
}
