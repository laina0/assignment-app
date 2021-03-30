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

  nom  = '';  
  auteur = '';
  dateDeRendu  = null;


  constructor(private assignmentsService:AssignmentsService,
              private router:Router,
              private _formBuilder: FormBuilder) {}

  ngOnInit(){
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

  }

  
  onSubmit(event) {
    
    const nouvelAssignment = new Assignment();
    nouvelAssignment.nom = this.firstFormGroup.value;
    nouvelAssignment.dateDeRendu = this.secondFormGroup.value; 
    nouvelAssignment.auteur = this.thirdFormGroup.value; 
    nouvelAssignment.rendu = false;

    console.log(nouvelAssignment);
    this.assignmentsService.addAssignment(nouvelAssignment)
      .subscribe(message => {
        console.log(message);
        console.log('finish');
         // et on navigue vers la page d'accueil qui affiche la liste
         
      });
  }
  
}
