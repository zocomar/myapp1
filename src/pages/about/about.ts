import { Component } from '@angular/core';
import { NavController, AlertController, DateTime } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  tasksRef: AngularFireList<any>;
  tasks: Observable<any[]>;
  fechaCorta: string = new Date().toISOString();
  fecha: string = this.fechaCorta;
  minFecha: string = (new Date().getFullYear()-5).toString();
  maxFecha: string = (new Date().getFullYear()+5).toString();
  user : any ;
  
  
  
  


  constructor(
      
      public navCtrl: NavController, 
      public alertCtrl: AlertController,
      public database: AngularFireDatabase,
      public auth : AuthProvider) {
        this.auth.getCurrentUser().subscribe(user => 
        this.user = user.uid);     
      
        this.tasksRef = this.database.list('tasks', 
        ref => ref.orderByChild('id').equalTo("gk81XDASuDWuUlTWDNRyfJu2SO33"));

      this.tasks = this.tasksRef.snapshotChanges()

      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    }
  
    /*pickId(id: string){
      this.tasksRef = this.database.list('tasks', 
        ref => ref.orderByChild('id').equalTo(id));
        this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    }*/

    createTask(){
      let newTaskModal = this.alertCtrl.create({
        title: 'New Task',
        message: "Enter a title for your new task",
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
                title: data.title,
                id: 'Corregido'
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
        id: 'Corregido'
      });
    }
  
    removeTask( task ){
      console.log( task );
      this.tasksRef.remove( task.key );
    }
  }

