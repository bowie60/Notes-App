import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {Note} from "../../shared/note.model";
import {NotesService} from "../../shared/notes.service";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      // Entry Animation
      transition('void => *', [
        // Initial state
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          // We have to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }),
        // We first want to animate the spacing (which includes height, margin and padding)
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*'
        })),
        animate(68)
      ]),

      transition('* => void', [
        // First scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // Then scale down to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75
        })),
        // Then scale down to zero and fade out completely
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0
        })),
        // Then animate the spacing (which includes height, margin and padding)
        animate('150ms ease-out', style({
          height: 0,
          'margin-bottom': '0',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }))
      ])
    ]),

    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    // Retrieve all notes from NotesService
    // @ts-ignore
    this.notesService.getAll().subscribe((notes: Note[]) => {
      this.notes = notes;
      console.log(this.notes);
      this.search(this.filterInputElRef.nativeElement);
    })
  }

  onDelete(note: Note) {
    this.notesService.delete(note._id).subscribe(() => {
      // Remove the note from the notes array
      this.notes.splice(this.notes.indexOf(note), 1);
      this.search(this.filterInputElRef.nativeElement);
    })
  }

  search(target: EventTarget | null) {
    let query = (target as HTMLInputElement).value.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    // Split up the search query into individual words
    let terms: string[] = query.split(' ');
    // Remove duplicate search terms
    terms = [...new Set(terms)];
    // Compile all relevant results
    terms.forEach(term => allResults = [...allResults, ...this.relevantNotes(term)]);
    // Remove duplicates
    this.filteredNotes = [...new Set(allResults)];
    // Sort by relevancy
    this.sortByRelevancy(allResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    return this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      return !!(note.body && note.body.toLowerCase().includes(query));
    });
  }

  sortByRelevancy(searchResults: Note[]) {
    // This method will calculate the relevancy of a note based on the number of times it appears in the search results
    let noteCountObj: Object = {}; // format - key:value => NoteId:number (note object id : count)

    searchResults.forEach(note => {
      // @ts-ignore
      if (noteCountObj[note._id]) {
        // @ts-ignore
        noteCountObj[note._id] += 1;
      } else {
        // @ts-ignore
        noteCountObj[note._id] = 1;
      }
    });

    // @ts-ignore
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => noteCountObj[b._id] - noteCountObj[a._id]);
  }
}
