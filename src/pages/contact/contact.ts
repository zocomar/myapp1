import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';
import { AboutPage } from '../about/about';




@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  qrData = null;
  createdCode = null;
  scannedCode = null;
  tasksRef: AngularFireList<any>;
  tasks: Observable<any[]>;
  user : any ;
  fechaCorta: string = new Date().toISOString();
  fecha: string = this.fechaCorta;
  minFecha: string = (new Date().getFullYear()-5).toString();
  maxFecha: string = (new Date().getFullYear()+5).toString();
  hora: string = (new Date().getUTCHours()+2).toString();
  testRadioOpen = false;
  testRadioResult: any;
  testCheckboxOpen = false;
  testCheckboxResult: any;
 
  constructor(
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public auth : AuthProvider) {
      this.auth.getCurrentUser().subscribe(user => 
      this.user = user.uid);
      this.tasksRef = this.database.list('tasks');
      /*ref => ref.orderByChild('id').equalTo(this.user));*/
      this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
});
  }
  
  
 
  createCode() {
    this.createdCode = this.qrData;
  }
 
  MostrarAlerta() {
    let alert = this.alertCtrl.create({
    /*title: this.user,*/
    title: this.minFecha,
    subTitle: 'Gracias, Hemos registrado tu lavado',
    buttons: ['Aceptar'],
  });
  alert.present();
}

  goToSecondPage() {
  this.navCtrl.push(AboutPage);
  }

  doRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    alert.addInput({
      type: 'radio',
      label: 'NORMAL FRIO',
      value: 'blue',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'NORMAL 30º',
      value: 'green'
    });

    alert.addInput({
      type: 'radio',
      label: 'NORMAL 40º',
      value: 'red'
    });

    alert.addInput({
      type: 'radio',
      label: 'DELICADO FRIO',
      value: 'yellow'
    });

    alert.addInput({
      type: 'radio',
      label: 'PIELES SENSIBLES',
      value: 'purple'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        // // this.barcodeScanner.scan().then(barcodeData => {
        // //   this.scannedCode = barcodeData.text;
        // });
        this.testRadioOpen = false;
        this.testRadioResult = data;
        this.tasksRef.push({
          title: this.scannedCode+" "+"prueba",
          fecha: this.fechaCorta.substring(0,10),
          hora: Date(),
          /*hora: this.fecha,*/
          id: this.user,
          lavado: this.testRadioResult
        });
        // this.MostrarAlerta();
        this.goToSecondPage();
      }
    });

    alert.present();
    
  }




  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  
  createTask(){
    let newTaskModal = this.alertCtrl.create({
      title: 'New Task',
      message: "Enter a title for your new task",
      inputs: [
        {
          name: this.scannedCode,
          placeholder: this.scannedCode
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.tasksRef.push({
              title: this.scannedCode+" "+"prueba",
              fecha: this.fechaCorta.substring(0,10),
              hora: Date(),
              /*hora: this.fecha,*/
              id: this.user,
              lavado: this.testRadioResult
            });
            
          }
        }
      ]
    });
    newTaskModal.present( newTaskModal );
    
  }

  updateTask( task ){
    this.tasksRef.update( task.key,{
      title: task.title,
      fecha: this.fechaCorta,
      /*hora: (new Date().getUTCHours()+2).toString(),*/
      hora: this.fecha,
      id: this.user,
      lavado: this.testRadioResult
      
    });
  }

  removeTask( task ){
    console.log( task );
    this.tasksRef.remove( task.key );
  }
}

