import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule} from '@angular/material/menu';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssignmentsComponent } from './assignments/assignments.component';
import { RenduDirective } from './shared/rendu.directive';
import { NonRenduDirective } from './shared/non-rendu.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { Routes, RouterModule } from '@angular/router';
import { EditAssigmentComponent } from './assignments/edit-assigment/edit-assigment.component';
import { AuthGuard } from './shared/auth.guard';
import { LoginFormComponent } from './authentication/login-form/login-form.component';
import { AuthInterceptor } from './shared/auth.interceptors';
import { DialogModule } from './dialog/dialog.module';
import { SnackbarAssignmentComponent } from './assignments/snackbar-assignment/snackbar-assignment.component';

const routes: Routes = [
  {
    // indique que http://localhost:4200 sans rien ou avec un "/" à la fin
    // doit afficher le composant AssignmentsComponent (celui qui affiche la liste)
    path: '',
    component: AssignmentsComponent,
    canActivate : [AuthGuard]
  },
  {
    // idem avec  http://localhost:4200/home
    path: 'home',
    component: AssignmentsComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'add',
    component: AddAssignmentComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'assignment/:id',
    component: AssignmentDetailComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'assignment/:id/edit',
    component: EditAssigmentComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'authenticate',
    component: LoginFormComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    AssignmentsComponent,
    RenduDirective,
    NonRenduDirective,
    AssignmentDetailComponent,
    AddAssignmentComponent,
    EditAssigmentComponent,
    LoginFormComponent,
    SnackbarAssignmentComponent
  ],
  exports: [MatSidenavModule, AssignmentsComponent], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule, MatDividerModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatListModule, MatCardModule, MatCheckboxModule,
    MatSlideToggleModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatToolbarModule,
    FlexLayoutModule,
    DragDropModule,
    MatExpansionModule,
    DialogModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
