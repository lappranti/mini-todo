import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ModelTask } from './modelTask';

@Injectable({
  providedIn: 'root',
})
export class ServiceTaskService {
  constructor(private http: HttpClient) {}

  postTask(newTask: ModelTask) {
    return this.http
      .post<ModelTask>('http://localhost:3000/TaskList', newTask)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  putTask(task: ModelTask) {
    return this.http
      .put<ModelTask>(`http://localhost:3000/TaskList/${task.id}`, task)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  deleteTask(task: ModelTask) {
    return this.http
      .delete<ModelTask>(`http://localhost:3000/TaskList/${task.id}`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getAllTask() {
    return this.http.get<ModelTask[]>('http://localhost:3000/TaskList').pipe(
      map((res) => {
        return res;
      })
    );
  }
}
