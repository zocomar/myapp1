import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';
import { AboutPage } from '../about/about';
import { TimerProgress } from '../timer-progress/timer-progress';
import { LocalNotifications } from '@ionic-native/local-notifications';





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
  unTexto: string="Hola";
 
  constructor(
    private barcodeScanner: BarcodeScanner,
    private localNotifications: LocalNotifications,private plt: Platform,
    public navCtrl: NavController,
    /*public alertCtrl: AlertController,*/
    public database: AngularFireDatabase,
    public alertCtrl: AlertController,
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
    title: '¡GRACIAS!',
    subTitle: 'Hemos registrado tu lavado. Te avisaremos en 30 min.',
    buttons: ['Aceptar'],
    
  });
  
  this.scheduleNot();
  alert.present();
  
  // this.goToSecondPage();
}

  goToSecondPage() {
  this.scheduleNot();
  this.navCtrl.push(TimerProgress,{'unTexto': this.fecha});
  }

  scheduleNot(){
    this.localNotifications.schedule({
      id:1,
      title:'Atencion',
      text:'Martin Notificacion',
      trigger: {at: new Date(new Date().getTime() + 3600)},
    });
  }

  doRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecciona tu Lavado');

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
      text: 'Ok.Avisame',
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
        this.scheduleNot();
      }
    });

    alert.present();
    
  }




  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.doRadio()
    }, (err) => {
        console.log('Error: ', err);
    });
    
  }
  
  createTask(){
    let newTaskModal = this.alertCtrl.create({
      title: 'Elige tu lavado',
      message: "Seleccione el lavado que has puesto",
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

