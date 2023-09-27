import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'dropdown-floatlabel-demo',
  templateUrl: './dropdown-floatlabel-demo.html',
})
export class DropdownFloatlabelDemo implements OnInit {
  form: FormGroup;
  selectedOption: string;
  selectedLevelOption: string;
  selectedApplyFromOption: string;
  educationTypeOptions: SelectItem[];
  subjectGradeOptions: SelectItem[];
  subjectOptions: SelectItem[];
  managementTypeOptions: SelectItem[];
  boardNameOptions: SelectItem[];
  groupNameOptions: SelectItem[];
  applyFromOptions: SelectItem[];
  // Define an array of form controls for subjects
  subjectControls: FormControl[] = [];
  // Define an array of form controls for subject grades
  subjectGradeControls: FormControl[] = [];
  subjectPairs: FormGroup[] = [];
  allProgramSubjectPairsBackup: FormGroup[] = [];
  managementSubjectPairsBackup: FormGroup[] = [];

  defaultSubjects = [
    { id: 2187, title: 'Bio/CS/IT ', description: 'Bio/CS/IT' },
    { id: 2191, title: 'Chemistry', description: 'Chemistry' },
    { id: 2198, title: 'English Language', description: 'English Language' },
    { id: 2222, title: 'Mathematics', description: 'Mathematics' },
    { id: 2227, title: 'Physics', description: 'Physics' },
    { id: 2226, title: 'Pakistan Studies', description: 'Pakistan Studies' },
    { id: 2240, title: 'Urdu', description: 'Urdu' },
    { id: 2217, title: 'Islamiyat', description: 'Islamiyat' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {}
  ngOnInit() {
    this.bindMatricForm();
    this.getSubjectList();
    this.educationTypeOptions = [
      { label: 'Matric', value: 'matric' },
      { label: 'O-Level', value: 'olevel' },
      { label: 'American High School System', value: 'american' },
    ];

    this.managementTypeOptions = [
      { label: 'Management Science Only', value: 'management' },
      { label: 'All Programs', value: 'all' },
    ];
    this.boardNameOptions = [
      { label: 'Mardan', value: 'mardan' },
      { label: 'Peshawar', value: 'peshawar' },
      { label: 'Swat', value: 'swat' },
      { label: 'Islamabad', value: 'islamabad' },
    ];
    this.groupNameOptions = [
      { label: 'Science', value: 'science' },
      { label: 'Arts', value: 'arts' },
      { label: 'Humanities', value: 'humanities' },
    ];
    this.subjectGradeOptions = [
      { label: 'A+', value: 'A+' },
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      // Add more options as needed
    ];
    this.applyFromOptions = [
      { label: 'Pakistan', value: 'pak' },
      { label: 'Overseas', value: 'overseas' },
      { label: 'Covid 19', value: 'covid' },
    ];
  }

  get f() {
    return this.form.controls;
  }

  getSubjectList() {
    this.http.get('assets/dropdownList.json').subscribe((data: any) => {
      this.subjectOptions = data.oLevelSubject;
      console.log(this.subjectOptions); // Log the JSON data to the console
    });
  }

  onDropdownChange(event) {
    // debugger;
    this.selectedOption = event?.value;
    if (this.selectedOption != 'olevel') {
      this.f['managementType'].setValue('');
      this.f['applyFrom'].setValue('');
    }
    console.log('Selected Option:', this.selectedOption);
  }
  onLeveltypeChange(event) {
    debugger;
    this.selectedLevelOption = event?.value;
    this.f['managementType'].setValue(event?.value);
    if (
      event?.value == 'all' &&
      (this.f['applyFrom'].value == '' || this.f['applyFrom'].value == null)
    ) {
      this.f['applyFrom'].setValue('');
      this.selectedApplyFromOption = '';
    } else {
      this.createSubjectInitialDropdown();
      // this.resetSubjectGradeValue();
    }
    console.log('Selected Level Option:', this.selectedLevelOption);
  }
  onApplyFromChange(event) {
    this.selectedApplyFromOption = event?.value;
    this.f['applyFrom'].setValue(event?.value);
    this.createSubjectDropdownForAllProgram(this.selectedApplyFromOption);
    console.log('Selected Apply From Option:', this.selectedApplyFromOption);
  }
  bindMatricForm() {
    this.form = this.fb.group({
      educationType: ['', Validators.required], // Default to 'matric'
      boardName: ['', Validators.required],
      groupName: ['', Validators.required],
      obtainedMarks: [null, Validators.required],
      totalMarks: [null, Validators.required],
      managementType: [null], // Optional, initially null
      applyFrom: [null],
      awardingInstitution: [''],
      obtainedMarksGrd9And10: [null],
      totalMarksGrd9And10: [null],
      subjectPairs: [''],
      subject: [''],
      subjectGrade: [''],
    });
    // this.createSubjectInitialDropdown();
  }
  createSubjectInitialDropdown() {
    this.subjectPairs = [];
    // Create eight pairs of form controls for subjects and subject grades
    for (let i = 0; i < 8; i++) {
      // Set a default subject value from the defaultSubjects array
      const defaultSubjectValue = this.defaultSubjects[i]
        ? this.defaultSubjects[i].title
        : '';
      const subjectPair = this.fb.group({
        subject: [defaultSubjectValue], // Default subject value (change as needed)
        subjectGrade: [''],
      });
      this.subjectPairs.push(subjectPair);
      // const defaultSubjectValue = this.defaultSubjects[i] ? this.defaultSubjects[i].title : '';
      // this.subjectControls.push(this.fb.control(defaultSubjectValue));
      // this.subjectGradeControls.push(this.fb.control(''));
    }
  }
  createSubjectDropdownForAllProgram(applyFrom: string = '') {
    this.subjectPairs = [];
    // Create eight pairs of form controls for subjects and subject grades
    for (let i = 0; i < 8; i++) {
      // Set a default subject value from the defaultSubjects array
      let defaultSubjectValue = '';
      if (applyFrom === 'pak') {
        defaultSubjectValue = this.defaultSubjects[i]
          ? this.defaultSubjects[i].title
          : '';
      } else {
        defaultSubjectValue = i < 5 ? this.defaultSubjects[i].title : '';
      }
      const subjectPair = this.fb.group({
        subject: [defaultSubjectValue], // Default subject value (change as needed)
        subjectGrade: [''],
      });
      this.subjectPairs.push(subjectPair);
      // const defaultSubjectValue = this.defaultSubjects[i] ? this.defaultSubjects[i].title : '';
      // this.subjectControls.push(this.fb.control(defaultSubjectValue));
      // this.subjectGradeControls.push(this.fb.control(''));
    }
  }

  onSubmit() {
    debugger;
    const type = this.f['educationType'].value;
    // Convert and store subjectPairs as a JSON string
    this.f['subjectPairs'].setValue(
      JSON.stringify(this.subjectPairs.map((pair) => pair.value))
    );
    // Log the value (for testing)
    console.log('Subject Pairs JSON:', this.f['subjectPairs'].value);
    console.log(
      'Subject Pairs JSON:',
      JSON.stringify(this.f['subjectPairs'].value)
    );
    console.log(
      'Subject Pairs:',
      this.subjectPairs.map((pair) => pair.value)
    );

    this.resetFormValues(type);
    console.log('Form Value:', this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  resetSubjectGradeValue() {
    this.subjectPairs.map((pair) => (pair.value.subjectGrade = ''));
  }

  resetFormValues(type: string) {
    switch (type) {
      case 'matric':
        this.f['subjectPairs'].setValue(null);
        this.f['awardingInstitution'].setValue(null);
        this.f['obtainedMarksGrd9And10'].setValue(null);
        this.f['totalMarksGrd9And10'].setValue(null);
        break;
      case 'olevel':
        // for matric
        this.f['awardingInstitution'].setValue(null);
        this.f['obtainedMarksGrd9And10'].setValue(null);
        this.f['totalMarksGrd9And10'].setValue(null);
        // for american school system
        this.f['boardName'].setValue(null);
        this.f['groupName'].setValue(null);
        this.f['obtainedMarks'].setValue(null);
        this.f['totalMarks'].setValue(null);
        break;
      case 'american':
        this.f['subjectPairs'].setValue(null);
        this.f['boardName'].setValue(null);
        this.f['groupName'].setValue(null);
        this.f['obtainedMarks'].setValue(null);
        this.f['totalMarks'].setValue(null);
        break;
      default:
        break;
    }
  }
}
