import { Component } from '@angular/core';
import { NavController, AlertController, DateTime } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';

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
  filteredItems: Array<Title>;

    
        
    


  constructor(
      public navCtrl: NavController, 
      public alertCtrl: AlertController,
      public database: AngularFireDatabase
    ) {
      
      /*this.tasksRef = this.database.list('tasks');*/
      this.tasksRef = this.database.list('tasks');
      this.tasks = this.tasksRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
    }
    getFilteredItems(ev) {
      console.log(ev.target.value);
      // use subscribe and foreach for filtering
      var val = ev.target.value;
      this.tasks.subscribe((_items)=> {
          this.filteredItems = [];
          _items.forEach(item => {
              if( item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                  this.filteredItems.push(item);
              } 
          })
      });        
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
                title: data.title,
                done: false,
                id:'corregido'
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

 