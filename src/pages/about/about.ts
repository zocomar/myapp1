import { Component } from '@angular/core';
import { NavController, AlertController, DateTime } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

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
  


  constructor(
      public navCtrl: NavController, 
      public alertCtrl: AlertController,
      public database: AngularFireDatabase
    ) {
      this.tasksRef = this.database.list('tasks');
      this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    }
  
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
                done: false
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
        done: !task.done
      });
    }
  
    removeTask( task ){
      console.log( task );
      this.tasksRef.remove( task.key );
    }
  }

