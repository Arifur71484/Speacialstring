import { Component , OnInit , OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
 
import { Message } from '@stomp/stompjs';

import { myRxStompConfig } from './my-rx-stomp.config'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  title = 'stringapp';
   
  private topicSubscription : Subscription ;

  New : string ;

  ReverseNew : String ;
  ReverseNN : String ;
 
  urlBroker : string ;
  userName  : string ;
  passcode : string ;
  topic : string ;
  brokerURL : string ;
  reverseString : string ;
 
 

    constructor (public rxStompService: RxStompService )   {
          
      this.urlBroker = myRxStompConfig.brokerURL
      this.userName = myRxStompConfig.connectHeaders.login
      this.passcode = myRxStompConfig.connectHeaders.passcode
      this.topic =   "something"
      this.topicSubscription =  null;
    }


    ngOnInit () {
      console.log("ngOnInit");
      this.rxStompService.deactivate()
  
      this.rxStompService.configure ({
        brokerURL : this.urlBroker ,
        connectHeaders: {
          login: this.userName,
          passcode: this.passcode
        },
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
        reconnectDelay: 5000,
      })

      this.rxStompService.activate();

      this.topicSubscription = this.rxStompService.watch( this.topic ).subscribe (
        (message: Message) => {    
          console.log("message.body", message.body); 
          this.ReverseNew = JSON.parse(message.body).value;

        },
        (err) => {
          console.log(err);
        }
      ); 
    }


  onSignUsers(form: NgForm)  {
    const Newname= form.value.name;     
    this.New =  this.reverse(Newname);
    this.ReverseNN  = this.ReverseNew ;
    
    console.log(this.New);
  }

    ngOnDestroy () {
      if (this.topicSubscription != null)
      
           this.topicSubscription.unsubscribe() ;
    }

      reverse(str:string) {
        var str1 = "$£"; 
        var str2=   str.split('').reverse().join(''); 
        var str3 ="£$"; 
         var res= str1.concat( str2, str3 ); 
        return res;
      
       }

}
