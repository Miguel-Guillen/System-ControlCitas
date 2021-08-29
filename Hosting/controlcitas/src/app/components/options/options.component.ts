import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CitasApiService } from './../../services/citas-api/citas-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { strings } from './../../shared/models/strings-template';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  icono: any = [];
  logotipo: any = [];
  preview: string;
  preview2: string;
  imagenUpload: null;
  imagenUpload2: null;
  id: number;
  option = {
    id_opciones: null,
    nombre_sitio: null,
    logotipo: null,
    icono: null,
    facebook: null,
    red_social: null,
    contacto: null,
    acerca_de: null
  }
  strings = strings;
  optionForm: FormGroup;

  validation_messages = {
    nombre_sitio: [
      { type: "required", message: "se requiere de un nombre"},
    ],
    logotipo: [
      { type: "required", message: "se requiere un logotipo"},
    ],
    icono: [
      { type: "required", message: "se requiere un icono"},
    ],
    contacto: [
      { type: "required", message: "se requiere la informacion de contacto del sitio"},
    ],
    acerca_de: [
      { type: "required", message: "se requiere un descripcion del sitio"},
    ]
  }

  constructor(private formB: FormBuilder, private citasA: CitasApiService,
    private sanitizer: DomSanitizer) {
      this.optionForm = this.formB.group({
        id_opciones: new FormControl(),
        nombre_sitio: new FormControl("", Validators.compose([
          Validators.required,
        ])),
        logotipo: new FormControl("", Validators.compose([
          Validators.required,
        ])),
        icono: new FormControl("", Validators.compose([
          Validators.required,
        ])),
        facebook: new FormControl(""),
        red_social: new FormControl(""),
        contacto: new FormControl("", Validators.compose([
          Validators.required,
        ])),
        acerca_de: new FormControl("", Validators.compose([
          Validators.required,
        ]))
      })
    }

  ngOnInit(): void {
    this.getOptions();
    document.getElementById('uno').style.display = 'none';
    document.getElementById('dos').style.display = 'none';
  }

  getOptions(){
    this.citasA.consulta('/options').subscribe((res: any) => {
      this.option = res[0];
      this.id = this.option.id_opciones;
      err =>{
        console.log(err);
      }
    });
  }

  editOptions(value){
    if (!this.optionForm.valid){
      document.getElementById('dos').style.display = 'block';
      setTimeout(() => document.getElementById('dos').style.display = 'none', 3000);
    }else{
      const formD = new FormData();
      const formDta = new FormData();
      this.icono.forEach(archivo => {
        formD.append('image', archivo);
      });
      this.logotipo.forEach(archivo => {
        formDta.append('image', archivo);
      });
      this.citasA.upload('/upload', formD).subscribe((res1: any) => {
        console.log(res1);
        this.citasA.upload('/upload', formDta).subscribe((res2: any) => {
          console.log(res2);
          const logotipo = res2.image;
          const icono = res1.image;
          this.registrarOpciones(value, logotipo, icono);
        });
      });
      err => {
        console.log(err)
      }
    }
  }

  registrarOpciones (value, logotipo, icono) {
    const options = {
      id_opciones: this.id,
      nombre_sitio: value.nombre_sitio,
      facebook: value.facebook,
      red_social: value.red_social,
      acerca_de: value.acerca_de,
      contacto: value.contacto,
      logotipo: logotipo,
      icono: icono
    }
    this.citasA.cambio(`/options/${this.id}`, options)
      .subscribe((res: any) => {
        this.getOptions();
        document.getElementById('uno').style.display = 'block';
        setTimeout(() => document.getElementById('uno').style.display = 'none', 3000);
        console.log(res);
    });
  }

  upload(event): any {
    this.imagenUpload = event.target.files[0];
    this.extraerBase64(this.imagenUpload).then((imagen: any) =>{
      this.preview = imagen.base;
    });
    this.logotipo.push(this.imagenUpload);
  }

  uploadIcon(event): any {
    this.imagenUpload2 = event.target.files[0];
    this.extraerBase64(this.imagenUpload2).then((imagen: any) =>{
      this.preview2 = imagen.base;
    });
    this.icono.push(this.imagenUpload2);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  cerrar(alerta: string) {
    document.getElementById(alerta).style.display = 'none';
  }
}
