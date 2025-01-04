import { CommonModule } from '@angular/common'
import { Component, Inject, inject, OnInit } from '@angular/core'
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelect } from '@angular/material/select'
import { RouterModule } from '@angular/router'
import { TranslocoModule, TranslocoService } from '@ngneat/transloco'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { NewPoliticaComponent } from 'app/modules/auth/sign-up/components/new-politica/new-politica.component'
import { OnlyNumbersDirective } from 'assets/only-number'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule,
    TranslocoModule,
    MatSelectModule,
    MatSelect,
     MatProgressSpinnerModule,
     OnlyNumbersDirective
  ],
})
export class NewUserComponent implements OnInit{
  userService = inject(UserService);
  transloco = inject(TranslocoService)
  tipoProv = [];
  category = [];
  rol = [];
  proveedor = [];
  fg: FormGroup;
  acepPol=true;
 matDialog = inject(MatDialog)
   constructor(
       public dialogRef: MatDialogRef<NewUserComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any,
       private fb: FormBuilder
     ) {
      console.log("Data received:", data);
    this.tipoProv = data.tipoProv;
    this.category = data.category;
    this.rol = data.rol;
    this.proveedor = data.proveedor.data;
     }
  ngOnInit(): void {
    this.LoadForm();
  }

LoadForm(){
 this.fg= this.fb.group({
    rol: ['', Validators.required],
    proveedor: [0, Validators.required],
    usuario: ['', Validators.required],
    correo: ['',  [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.required]],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    area: ['']
  })
if(this.data.boton == 'Editar'){
  this.fg.patchValue({
    rol: this.data.data.idPerfil,
    // proveedor: this.data.data.idProveedor ,
    usuario: this.data.data.usuario,
    correo: this.data.data.correo ,
    nombres: this.data.data.nombre ,
    apellidos: this.data.data.apellido ,
    area: this.data.data.area ,
  })
}

}
  doRegister() {
    const formData = this.fg.getRawValue();
    if(this.data.boton == 'Crear'){
      this.userService.crearUsers(formData).subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.dialogRef.close(true);
        }
      })
    }else{
      formData.idUser = this.data.data.idUser;
      formData.idPersona = this.data.data.idPersona;
      this.userService.updateUsers(formData).subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.dialogRef.close(true);
        }
      })
    }
 
  }
}
