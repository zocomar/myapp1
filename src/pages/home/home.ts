import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/*var user = this.auth.user*/


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tabBarElement: any;
  splash = true;
  user : any ;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public auth : AuthProvider) {
    this.tabBarElement = document.querySelector('.tabbar')
    this.auth.getCurrentUser().subscribe(user => 
      this.user = user.uid);}
    
  
  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 8000);
  let alert = this.alertCtrl.create({
    title: this.user,
    subTitle: '10% of battery remaining',
    buttons: ['Dismiss']
  });
  alert.present();
}
  

  cerrarSesion(){
    this.auth.logout();
}
}

