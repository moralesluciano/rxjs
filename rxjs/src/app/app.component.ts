import { Component, ViewChild, OnInit } from '@angular/core';
import { fromEvent, Observable, interval, from } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { spawn } from 'child_process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rxjs';
  clickObservable: Observable<Event> = fromEvent(document,'click');

  ngOnInit() {
    //this.subscribeToObservable();

    //this.testMap();

    //this.testMergeMap()

    this.testSwitchMap();

  }

  private subscribeToObservable() {
    this.clickObservable.subscribe(() => {
      console.log(`The dom has been clicked!`);
    })
  }

  private testMap() {
    const inter = interval(1000);
    const observer = {
      next: function(value) {
        console.log(value);
      }
    };

    inter.pipe(
      map((value) => {
        return 'Number: ' + value;
      })
    ).subscribe(observer)
  }

  private testMergeMap() {
    // do not want to use @ViewChild for this test
    const span = document.querySelector('span');
    const input1 = document.querySelector('#input1');
    const input2 = document.querySelector('#input2');

    const obs1 = fromEvent(input1, 'input');
    const obs2 = fromEvent(input2, 'input');

    obs1.pipe(
      mergeMap(
        event1 => {
          return obs2.pipe(map(
            event2 => event1.target['value'] + ' ' + event2.target['value']
          ))
        }
      )
    ).subscribe(
      combinedValue => span.textContent = combinedValue
    )
  }

  private testSwitchMap() {
    const button = document.querySelector('button');

    const obs1 = fromEvent(button, 'click');
    const obs2 = interval(1000);

    // issue: multiples observables running at the same time
    // obs1.subscribe(
    //   (event) => obs2.subscribe(
    //     (value) => console.log(value)
    //   )
    // );

    // fix to the code above
    obs1.pipe(
      switchMap(event => {
        return obs2
      })
    ).subscribe(
      (value) => console.log(value)
    )
  }

}
