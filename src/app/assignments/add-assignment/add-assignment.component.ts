import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Pour les steppers
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  isEditable = true;

  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      date: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      author: ['', Validators.required]
    });

  }

  onSubmit(event) {

    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      const assignment = new Assignment();
      assignment.nom = this.firstFormGroup.get('name').value;
      assignment.dateDeRendu = this.secondFormGroup.get('date').value;
      assignment.auteur = this.thirdFormGroup.get('author').value;
      assignment.rendu = false;
      console.log(assignment);
      /*this.assignmentsService.addAssignment(nouvelAssignment)
        .subscribe(message => {
          console.log(message);
          console.log('finish');
          // et on navigue vers la page d'accueil qui affiche la liste
        });*/
    }
  }
}
