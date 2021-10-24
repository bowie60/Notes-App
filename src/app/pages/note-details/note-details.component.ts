import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Note} from "../../shared/note.model";
import {NotesService} from "../../shared/notes.service";

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note!: Note;
  new!: boolean;

  constructor(private notesService: NotesService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Check if it's an already existing note (editing) or a new note (creating)
    this.activatedRoute.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        // @ts-ignore
        this.notesService.get(params.id).subscribe((note: Note) => {
          this.note = note;
        });
        this.new = false;
      } else {
        this.new = true;
      }
    })
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      // Save the note and Redirect to homepage
      this.notesService.add(form.value).subscribe(() => this.router.navigateByUrl('/'))
    } else {
      this.note.title = form.value.title;
      this.note.body = form.value.body;

      this.notesService.update(this.note).subscribe(() => this.router.navigateByUrl('/'))
    }
  }

  onCancel() {
    // Redirect to homepage
    this.router.navigateByUrl('/');
  }

}
