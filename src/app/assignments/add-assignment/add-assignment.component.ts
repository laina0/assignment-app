import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { CoursService } from 'src/app/shared/cours.service';
import { Assignment } from '../assignment.model';
import { Cours } from '../cours.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {

  cours: Cours[] = [];
  // Pour les steppers
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  isEditable = true;

  constructor(private assignmentsService: AssignmentsService,
              private coursService: CoursService,
              private router: Router,
              private formBuilder: FormBuilder) {}


  // tslint:disable-next-line: typedef
  ngOnInit(){
    this.initForm();
    this.getCours();
  }

  getCours(){
    this.coursService.getCours()
    .subscribe(data => {
        this.cours =  data.docs;
    });
  }

  onSubmit(event) {

    if (this.firstFormGroup.valid
      && this.secondFormGroup.valid
      && this.thirdFormGroup.valid
      && this.fourthFormGroup.valid) {

      const assignment = new Assignment();
      assignment.nom = this.firstFormGroup.get('name').value;
      assignment.dateDeRendu = this.secondFormGroup.get('date').value;
      assignment.auteur = this.thirdFormGroup.get('author').value;
      assignment.cours = this.fourthFormGroup.get('cours').value;
      assignment.rendu = false;

      this.assignmentsService.addAssignment(assignment)
        .subscribe(message => {
            this.router.navigate(['/home']);
        });
    }
  }

  private initForm() {
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      date: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      author: ['', Validators.required]
    });
    this.fourthFormGroup = this.formBuilder.group({
      cours: ['', Validators.required]
    });
  }
}
