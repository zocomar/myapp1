import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';




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
  testCheckboxOpen: any;
  testCheckboxResult:any;
 
  constructor(
    private barcodeScanner: BarcodeScanner,
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
 
  
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  setIonicDateTime(value: string): Date {
    if (value) {
        let date: Date = new Date(value);
        let ionicDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        return ionicDate;
    }
    return null;
  }
  getIonicDateTime(value: Date): string {
    if (value) {
        let date: Date = new Date(value);
        let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        return ionicDate.toISOString();
    }
    return null;
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
              title: this.scannedCode+"prueba",
              fecha: this.fechaCorta.substring(0,10),
              hora: Date(),
              /*hora: this.fecha,*/
              id: this.user
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
      id: this.user
      
    });
  }

  removeTask( task ){
    console.log( task );
    this.tasksRef.remove( task.key );
  }
}

