import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LivraisonService, Livraison } from 'src/app/front-office/livraison/livraisonService/livraison-service.service';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  livraisons: Livraison[] = [];
  livraisonForm: FormGroup;
  isEdit = false;


  constructor(private fb: FormBuilder, private livraisonService: LivraisonService) {
    this.livraisonForm = this.fb.group({
      idLivraison: [null],
      address: ['', Validators.required],
      duration: ['', Validators.required],
      scheduleddate: ['', Validators.required],
      status: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLivraisons();
  }

  loadLivraisons(): void {
    this.livraisonService.getAllLivraisons().subscribe((data) => {
      this.livraisons = data;
    });
  }

  onSubmit(): void {
    const livraison: Livraison = this.livraisonForm.value;

    this.livraisonService.addLivraison(livraison).subscribe(() => {
      this.loadLivraisons();
      this.resetForm();
    });
  }





  resetForm(): void {
    this.isEdit = false;
    this.livraisonForm.reset({
      idLivraison: null,
      address: '',
      duration: '',
      scheduleddate: '',
      status: '',
    });
  }
}
