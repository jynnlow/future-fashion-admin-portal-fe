import { Component, OnInit, ViewChild, TemplateRef, destroyPlatform } from '@angular/core';
import { HttpService } from '../services/http.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import * as dto from '../dto/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  //class properties
  mode = 'add';

  //datatable related
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
  users: dto.User[] = [];

  //modal content
  modalRef?: BsModalRef;
  @ViewChild('userModal') userModal: TemplateRef<any> = <TemplateRef<any>>{};

  //user dto
  userReq: dto.User = {
    id: 0,
    username: '',
    password: '',
    role: '',
    dob: '',
    chest: 0,
    waist: 0,
    hip: 0,
  }

  constructor(
    private http: HttpService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  async loadUsers(){
    this.http.getUsers().subscribe({
      next: (data) => {
        if(data.status !== 'SUCCESS') {
          Swal.fire('Error', data.message, 'error');
          return;
        }
        this.users = data.details.users;
        this.dtTrigger.next(null);
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');

      }
    })
  }

  loadUser(id: number){
    let foundUser = this.users.find(user => user.id === id);
    if (foundUser) {
      this.userReq = foundUser;
      return;
    }
    Swal.fire('Error', 'error fetching user', 'error');
  }

  resetUserReq(){
    this.userReq = {
      id: 0,
      username: '',
      password: '',
      role: '',
      dob: '',
      chest: 0,
      waist: 0,
      hip: 0,
    }
  }

  rerender(){
    this.loadUsers();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next(null);
    });
  }

  openAddUserModal(){
    this.mode = 'add';
    this.resetUserReq();
    this.openModel(this.userModal);
  }

  openEditUserModal(id: number){
    this.mode = 'edit';
    this.loadUser(id);
    this.openModel(this.userModal);
  }

  openModel(modal: TemplateRef<any>){
    this.modalRef = this.modalService.show(modal);
    this.modalRef.setClass('model-xl');
  }

   async addUser(){
    const confirmRes = await Swal.fire({
      title: 'Add User',
      text: 'Confirm adding user?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.addUsers(this.userReq).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', data['message'], 'error');
          }else{
            Swal.fire('Success', `user added successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', err, 'error')
        }
      })
    }
  }

  async editUser() {
    const confirmRes = await Swal.fire({
      title: 'Edit User',
      text: 'Confirm edit uer?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.editUser(this.userReq).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', data['message'], 'error');
          }else{
            Swal.fire('Success', `user edited successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', err, 'error')
        }
      })
    }
  }

  async deleteUser() {
    const confirmRes = await Swal.fire({
      title: 'Delete User',
      text: 'Confirm delete User?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.deleteUser(this.userReq.id).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', data['message'], 'error');
          }else{
            Swal.fire('Success', `user deleted successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', err, 'error')
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
