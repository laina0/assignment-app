import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments:Assignment[];

  // on injecte le service de gestion des assignments
  constructor(private assignmentsService:AssignmentsService, private router: Router) {}

  ngOnInit() {

    // on utilise le service pour récupérer les
    // assignments à afficher
    this.assignmentsService.getAssignments()
      .subscribe(assignments => {
        
        this.assignments = assignments;
      });
  }

  onDeleteAssignment(event) {
    // event = l'assignment à supprimer

    //this.assignments.splice(index, 1);
    this.assignmentsService.deleteAssignment(event)
      .subscribe(message => {
        console.log(message);
      });
  }

  onPopulate() {
    this.assignmentsService.populate().subscribe(message => {
      console.log(message);
      return this.router.navigate(['/home'], {replaceUrl: true});
    });
  }
}
