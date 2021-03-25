import { Cours } from './cours.model';

export class Assignment {
  // tslint:disable-next-line: variable-name
  _id: number;
  id: number;
  nom: string;
  dateDeRendu: Date;
  rendu: boolean;
  auteur: string;
  note?: number;
  remarque?: string;
  cours: Cours;
}
