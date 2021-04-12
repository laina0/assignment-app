import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, pairwise, throttleTime } from 'rxjs/operators';
import { DialogData } from '../dialog/models/dialog-data.model';
import { DialogFactoryService } from '../dialog/sevices/dialog-factory.service';
import { DialogService } from '../dialog/sevices/dialog.service';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  options: FormGroup;
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
  isLoader: boolean;
  isLoadignSpinner: boolean;

  formVisible = false;

  // Pour la partie progessbar, nous avons pris le bout du code sur le site:
  // https://stackblitz.com/edit/material-loadingbar?file=app%2Fapp.component.ts
  // https://material.angular.io/components/progress-bar/api
  @Input() value: number;

  @ViewChild("scroller") scroller: CdkVirtualScrollViewport;

  // Nous avons pris la partie du code du boite de dialogue sur l'url suivant:
  // https://www.codegram.com/blog/playing-with-dialogs-and-ng-templates/
  dialog: DialogService;
  @ViewChild('notationDialogTemplate')
  notationDialogTemplate: TemplateRef<any>;

  // Nous avois pris la partie du code du drag&drop sur le site suivant:
  // https://www.positronx.io/angular-7-drag-drop-tutorial-material-library/
  eventAssignment: CdkDragDrop<Assignment[]>;
  currentAssignment: Assignment;

  formNotation: FormGroup;

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private route: ActivatedRoute,
              private dialogFactoryService: DialogFactoryService,
              private formBuilder: FormBuilder,
              private ngZone: NgZone,
              private _snackBar: MatSnackBar) 
              {
                this.options = formBuilder.group({
                  bottom: 0,
                  fixed: false,
                  top: 0
                });
              }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    // on initialise le formulaire pour la notation
    this.formNotation = this.initNotationForm();
    this.isLoader = false;
    this.isLoadignSpinner = false;

    // on utilise le service pour récupérer les
    // assignments à afficher
    this.route.queryParams.subscribe(queryParams => {
      this.page = +queryParams.page || 1;
      this.limit = +queryParams.limit || 10;

      this.getAssignments(true);
      this.getAssignments(false);
    });
  }

  getAssignments(rendu: boolean) {
    this.isLoader = true;
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit, rendu)
    .subscribe(data => {
      if (!rendu) {
        this.assignments = data.docs;
      } else {
        this.assignmentsRendus = data.docs;
      }
      
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;
      this.isLoader = false;
    });
  }

  getAssignmentForScrolling() {
    this.isLoadignSpinner = true;
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit, false)
    .subscribe(data => {
      this.assignments = this.assignments.concat(data.docs);
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;
      this.isLoadignSpinner = false;
    });
  }

  ngAfterViewInit() {
    
    // Appelé automatiquement après l'affichage, donc l'élément scroller aura
    // et affiché et ne vaudra pas "undefined" (ce qui aurait été le cas dans ngOnInit)

    // On va s'abonner aux évenements de scroll sur le scrolling...
    this.scroller
      .elementScrolled()
      .pipe(
        map((event) => {
          return this.scroller.measureScrollOffset("bottom");
        }),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 200),
        throttleTime(200) // on ne va en fait envoyer le dernier événement que toutes les 200ms.
        // on va ignorer tous les évéments arrivés et ne garder que le dernier toutes
        // les 200ms
      )
      .subscribe((dist) => {
        this.ngZone.run(() => {
          if (this.hasNextPage) {
            this.page = this.nextPage;
            this.getAssignmentForScrolling();
          }
        });
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

  onEditAssignement(assignment: Assignment) {
    this.formNotation.reset();
    this.currentAssignment = assignment;
    this.dispatchDialog();
  }

  // tslint:disable-next-line: typedef
  onDrop(event: CdkDragDrop<Assignment[]>) {
    this.currentAssignment = null;
    this.formNotation.reset();
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.currentAssignment = event.previousContainer.data[event.previousIndex];
      this.eventAssignment = event;
      this.dispatchDialog();
    }
  }

  // Pour la partie notation sur le drag&drop
  // On a choisi d'utiliser un dialog pour pouvoir modifier le note et le remarque du rendu
  // Voici l'url qu'on a utilisé pour se documenter
  // https://www.codegram.com/blog/playing-with-dialogs-and-ng-templates/
  // tslint:disable-next-line: typedef
  private dispatchDialog() {
    this.openDialog({
      headerText: 'Veuillez ajouter une note au rendu',
      template: this.notationDialogTemplate
    });
  }

  submit(): void {
    if (this.formNotation.valid) {
      this.currentAssignment.note = this.formNotation.get('notation').value;
      this.currentAssignment.remarque = this.formNotation.get('remarque').value;
      this.currentAssignment.rendu = true;

      this.assignmentsService
          .updateAssignment(this.currentAssignment)
          .subscribe((message) => {
            this.eventAssignment && transferArrayItem(this.eventAssignment.previousContainer.data,
              this.eventAssignment.container.data,
              this.eventAssignment.previousIndex,
              this.eventAssignment.currentIndex);
            this.closeDialog();
            this.getAssignments(true);
            this.getAssignments(false);
      });
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
      remarque: [null]
    });
  }

  onAddAssignmentBtnClick() {
    this.formVisible = !this.formVisible;
  }

  onNouvelAssignment(event) {
    // l'event est l'assignment ajouté par le composant
    // fils qui a émis l'événement

    this.assignments.push(event);

    // on cache le formulaire, et on re-affiche la liste
    this.formVisible=false;
  }

  showSnackbar(content, action, duration) {
    let sb = this._snackBar.open(content, action, {
      duration: duration,
      panelClass: ["custom-style"]
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }

}
