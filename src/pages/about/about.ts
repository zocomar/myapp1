import { Component } from '@angular/core';
import { NavController, AlertController, DateTime } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  qrData = null;
  createdCode = null;
  scannedCode = null;
  tasksRef: AngularFireList<any>;
  tasks: Observable<any[]>;
  fechaCorta: string = new Date().toISOString();
  fecha: string = this.fechaCorta;
  minFecha: string = (new Date().getFullYear()-5).toString();
  maxFecha: string = (new Date().getFullYear()+5).toString();
  user: any; 
  
 
 
  constructor(
      public navCtrl: NavController, 
      public alertCtrl: AlertController,
      public database: AngularFireDatabase,
      public auth : AuthProvider) {
      this.auth.getCurrentUser().subscribe(user => 
        this.user = user.uid);
      

      /*this.tasksRef = this.database.list('tasks');*/
      this.tasksRef = this.database.list('tasks',
        ref => ref.orderByChild('id').equalTo (this.auth.getUser()));
        this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      });
    }
    ionViewDidLoad() {
      let alert = this.alertCtrl.create({
      /*title: this.user,*/
      title: this.user,
      subTitle: 'Este es el usuario activo',
      buttons: ['Dismiss'],
    });
    alert.present();
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
        title: 'New Task',
        message: "Enter a title for your new task again",
        inputs: [
          {
            name: 'title',
            placeholder: 'Title'
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
                title: this.scannedCode,
                fecha: this.minFecha.substr(0,10),
                hora: this.fecha,
                /*hora:this.getIonicDateTime,*/
                id:this.user
              });
            }
          }
        ]
      });
      newTaskModal.present( newTaskModal );
    }
  
    updateTask( task ){
      this.tasksRef.update( task.key,{
        title: this.scannedCode,
        fecha: this.fechaCorta,
        id:this.user
      });
    }
  
    removeTask( task ){
      console.log( task );
      this.tasksRef.remove( task.key );
    }
  }

 