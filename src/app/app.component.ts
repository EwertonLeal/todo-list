import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITodo } from './models/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  formNewCardCreator!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  todo: any[] = [];
  doing: any[] = [];
  review: any[] = [];
  done: any[] = [];

  ngOnInit(): void {
    this.formNewCardCreator = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
    });

    if (localStorage.getItem('todo')) {
      let todo: any = localStorage.getItem('todo');
      this.todo = JSON.parse(todo);
    }

    if (localStorage.getItem('doing')) {
      let doing: any = localStorage.getItem('doing');
      this.doing = JSON.parse(doing);
    }

    if (localStorage.getItem('review')) {
      let review: any = localStorage.getItem('review');
      this.review = JSON.parse(review);
    }

    if (localStorage.getItem('done')) {
      let done: any = localStorage.getItem('done');
      this.done = JSON.parse(done);
    }
  }

  addNewCard(event: SubmitEvent) {
    event.preventDefault();

    const newCard: ITodo = {
      id: crypto.randomUUID(),
      title: this.formNewCardCreator.get('title')?.value,
      description: this.formNewCardCreator.get('description')?.value,
    };

    this.todo.unshift(newCard);

    localStorage.setItem('todo', JSON.stringify(this.todo));

    this.formNewCardCreator.reset();
  }

  updateLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(this.todo));
    localStorage.setItem('doing', JSON.stringify(this.doing));
    localStorage.setItem('review', JSON.stringify(this.review));
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  removeCard(id: string){
    if(this.todo.find(x => x.id == id)) {
      this.todo = this.todo.filter(x => x.id !== id);
    }
    
    if(this.doing.find(x => x.id == id)) {
      this.doing = this.doing.filter(x => x.id !== id);
    }

    if(this.review.find(x => x.id == id)) {
      this.review = this.review.filter(x => x.id !== id);
    }

    if(this.done.find(x => x.id == id)) {
      this.done = this.done.filter(x => x.id !== id);
    }
  }

  drop(event: CdkDragDrop<string[] | any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateLocalStorage();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateLocalStorage();
    }
  }
}
