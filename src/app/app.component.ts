import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { ModelTask } from './modelTask';
import { ServiceTaskService } from './service-task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDark: boolean = true;
  selectedStatus: string = 'All';

  newTaskDescription!: string;
  taskLis!: ModelTask[];
  copyTaskList: ModelTask[] = [];
  statusList: Array<string> = ['All', 'Active', 'Completed'];

  editingTask!: ModelTask;
  editingTaskDescription!: string;
  isEditing!: boolean;

  constructor(private renderer: Renderer2, private api: ServiceTaskService) {}
  ngOnInit(): void {
    this.getAllTask();
  }

  ngAfterViewInit() {
    let statusAll = document.getElementById(this.selectedStatus);
    this.renderer.addClass(statusAll, 'active');
  }

  handleSelectStatus(id: string) {
    this.selectedStatus = id;
    this.getTaskListByStatus(this.selectedStatus);

    let currentActiveStatus = document.querySelector('.active');
    this.renderer.removeClass(currentActiveStatus, 'active');
    this.renderer.addClass(
      document.getElementById(this.selectedStatus),
      'active'
    );
  }

  getTaskListByStatus(status: string) {
    this.taskLis = this.copyTaskList;
    if (status === 'All') return;
    else {
      let statusBoolean: boolean = status === 'Active' ? true : false;

      this.taskLis = this.taskLis.filter((p) => p.isActive === statusBoolean);
    }
  }

  handleToggleTheme() {
    this.isDark = !this.isDark;
  }

  AddNewTask(value: string) {
    let task: ModelTask = {
      id: UUID.UUID(),
      description: this.capitalizeFirstLetter(value),
      date: new Date(),
      isActive: true,
      isCompleted: false,
    };

    this.api.postTask(task).subscribe(() => {
      this.newTaskDescription = '';
      this.taskLis.push(task);
      this.copyTaskList = [...this.taskLis];
    });
  }

  handleCompletedTask(task: ModelTask) {
    task.isActive = !task.isActive;
    task.isCompleted = !task.isCompleted;

    this.updateTask(task);
  }

  updateTask(task: ModelTask) {
    this.api.putTask(task).subscribe(() => {
      let index = this.taskLis.indexOf(task);
      this.taskLis.splice(index, 1, task);
    });
  }

  deleteTask(task: ModelTask) {
    this.api.deleteTask(task).subscribe(() => {
      this.api.getAllTask().subscribe((res) => {
        this.taskLis = this.taskLis.filter((p) => p.id != task.id);
        this.copyTaskList = res;
      });
    });
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getAllTask() {
    this.api.getAllTask().subscribe((res) => {
      this.taskLis = res;
      this.copyTaskList = res;
    });
  }

  handleClearAll() {
    this.taskLis = [];
    this.copyTaskList = [];
  }

  handleEditeTask(task: ModelTask) {
    this.editingTask = task;
    this.editingTaskDescription = task.description;
    console.log(this.editingTask);
  }

  handleEditeTaskContent(task: ModelTask) {
    if (this.editingTaskDescription != '') {
      this.editingTask.description = this.editingTaskDescription;
      this.updateTask(this.editingTask);
      this.editingTask = Object.assign({});
    }
  }

  handleCanncelEdite() {
    this.editingTask = Object.assign({});
  }
}
