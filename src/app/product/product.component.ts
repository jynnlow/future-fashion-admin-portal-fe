import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { HttpService } from '../services/http.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import * as dto from '../dto/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  //class properties
  mode = 'add';

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

  // table content
  products: dto.Product[] = [];

  // modal content
  modalRef?: BsModalRef;
  @ViewChild('productModal') productModal: TemplateRef<any> = <TemplateRef<any>>{};
  
  //product dto
  productReq: dto.Product = {
    id: 0,
    item: '',
    price: 0,
    stock: 0,
    pictures: [],
    xs: this.getGenericSizing(),
    s: this.getGenericSizing(),
    m: this.getGenericSizing(),
    l: this.getGenericSizing(),
    xl: this.getGenericSizing()
  };

  constructor(
    private http: HttpService,
    private modalService: BsModalService
  ) { }
  
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.http.getProducts().subscribe({
      next: (data) => {
        if(data.status !== 'SUCCESS') {
          Swal.fire('Error', 'error in loading data', 'error');
          return;
        }
        this.products = data.details.products;
        this.dtTrigger.next(null);
      },
      error: (err) => {
        Swal.fire('Error', 'error in loading data', 'error');
      }
    })
  }
  
  loadProduct(id: number) {
    let foundProduct = this.products.find(product => product.id === id);
    if(foundProduct) {
      this.productReq = foundProduct;
      return;
    }
    Swal.fire('Error', 'error fetching product', 'error');
  }


  openModal(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
    this.modalRef.setClass('modal-xl');
  }

  openAddProductModal() {
    this.mode = 'add'; 
    this.resetProductReq(); 
    this.openModal(this.productModal);
  }

  openEditProductModal(id: number) {
    this.mode = 'edit';
    this.loadProduct(id);
    this.openModal(this.productModal);
  }

  getGenericSizing(): dto.Sizing {
    return {
      chest: 0,
      waist: 0,
      hip: 0
    };
  }

  resetProductReq(){
    this.productReq = {
      id: 0,
      item: '',
      price: 0,
      stock: 0,
      pictures: [],
      xs: this.getGenericSizing(),
      s: this.getGenericSizing(),
      m: this.getGenericSizing(),
      l: this.getGenericSizing(),
      xl: this.getGenericSizing()
    };
  }

  async addProduct() {
    const confirmRes = await Swal.fire({
      title: 'Add Product',
      text: 'Confirm adding product?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.addProduct(this.productReq).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', `error is ${data['message']}`, 'error');
          }else{
            Swal.fire('Success', `product added successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', `error is ${err}`, 'error')
        }
      })
    }
  }

  async editProduct() {
    const confirmRes = await Swal.fire({
      title: 'Edit Product',
      text: 'Confirm edit product?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.editProduct(this.productReq).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', `error is ${data['message']}`, 'error');
          }else{
            Swal.fire('Success', `product edited successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', `error is ${err}`, 'error')
        }
      })
    }
  }

  async deleteProduct() {
    const confirmRes = await Swal.fire({
      title: 'Delete Product',
      text: 'Confirm delete product?',
      icon: 'question',
      showDenyButton: true,
      heightAuto: false
    });

    if(confirmRes.isConfirmed) {
      this.http.deleteProduct(this.productReq.id).subscribe({
        next: data => {
          if(data['status'] !== 'SUCCESS') {
            Swal.fire('Error', `error is ${data['message']}`, 'error');
          }else{
            Swal.fire('Success', `product deleted successfully`, 'success');
            this.rerender();
            this.modalRef?.hide();
          }
        }, error: err => {
          Swal.fire('Error', `error is ${err}`, 'error')
        }
      })
    }
  }

  rerender() {
    this.loadProducts();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next(null);
    });
  }

  async convertImgToBase64(event: any) {
    this.productReq.pictures = [];
    if(event.target.files.length > 0) {
      for(const picture of event.target.files) {
        let base64img = await this.toBase64(picture) as string;
        this.productReq.pictures.push(base64img);
      }
    }
  }

  async toBase64(file: any) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => res(reader.result);
      reader.onerror = error => rej(error);
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
