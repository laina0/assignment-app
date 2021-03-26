import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData } from '../dialog/models/dialog-data.model';
import { DialogFactoryService } from '../dialog/sevices/dialog-factory.service';
import { DialogService } from '../dialog/sevices/dialog.service';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  assignmentsRendus: Assignment[] = [];
  page = 1;
  limit = 10;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  prevPage: number;
  hasNextPage: boolean;
  nextPage: number;

  dialog: DialogService;
  @ViewChild('notationDialogTemplate')
  notationDialogTemplate: TemplateRef<any>;

  eventAssignment: CdkDragDrop<Assignment[]>;

  formNotation: FormGroup;

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private route: ActivatedRoute,
              private dialogFactoryService: DialogFactoryService,
              private formBuilder: FormBuilder) {}

  // tslint:disable-next-line: typedef
  ngOnInit() {

    // on initialise le formulaire pour la notation
    this.formNotation = this.initNotationForm();

    // on utilise le service pour récupérer les
    // assignments à afficher
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments();
    });
  }

  getAssignments() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
    .subscribe(data => {
      this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;
    });
  }

  onDeleteAssignment(event) {
    // event = l'assignment à supprimer

    // this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
      });
  }

  onPopulate() {
    this.assignmentsService.populate().subscribe(message => {
      console.log(message);
      return this.router.navigate(['/home'], {replaceUrl: true});
    });
  }

  premierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: 1,
        limit: this.limit,
      }
    });
  }

  pageSuivante() {
    /*
    this.page = this.nextPage;
    this.getAssignments();*/
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.nextPage,
        limit: this.limit,
      }
    });
  }


  pagePrecedente() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.prevPage,
        limit: this.limit,
      }
    });
  }

  // tslint:disable-next-line: typedef
  dernierePage() {
    this.router.navigate(['/home'], {
      queryParams: {
        page: this.totalPages,
        limit: this.limit,
      }
    });
  }

  // tslint:disable-next-line: typedef
  onDrop(event: CdkDragDrop<Assignment[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.eventAssignment = event;
      this.dispatchDialog();
    }
  }

  // Pour la partie notation sur le drag&drop
  // On a choisit d'utiliser un dialog pour pouvoir modifier les notes du rendu
  // Voici l'url qu'on a utilisé pour se documenter
  // https://www.codegram.com/blog/playing-with-dialogs-and-ng-templates/
  // tslint:disable-next-line: typedef
  dispatchDialog() {
    this.openDialog({
      headerText: 'Veuillez ajouter une note au rendu',
      template: this.notationDialogTemplate
    });
  }

  submit(): void {
    if (this.formNotation.valid) {
      const event = this.eventAssignment;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.closeDialog();
    }
  }

  // tslint:disable-next-line: typedef
  closeDialog() {
    this.dialog.close();
  }

  private openDialog(dialogData: DialogData): void {
    this.dialog = this.dialogFactoryService.open(dialogData);
  }

  // tslint:disable-next-line: typedef
  private initNotationForm() {
    return this.formBuilder.group({
      notation: [null, [Validators.required, Validators.max(20), Validators.min(0)]],
    });
  }
}
