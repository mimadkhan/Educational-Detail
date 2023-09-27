import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'dropdown-floatlabel-demo',
  templateUrl: './dropdown-floatlabel-demo.html',
})
export class DropdownFloatlabelDemo implements OnInit {

  form!: FormGroup;
  isRequired = [Validators.required];
  selectedOption!: string;
  selectedLevelOption!: string;
  selectedApplyFromOption!: string;
  educationTypeOptions!: SelectItem[];
  subjectGradeOptions!: SelectItem[];
  subjectOptions!: SelectItem[];
  managementTypeOptions!: SelectItem[];
  boardNameOptions!: SelectItem[];
  groupNameOptions!: SelectItem[];
  applyFromOptions!: SelectItem[];
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
    // this.subjectOptions = controlsListType.oLevelSubject;
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

  onDropdownChange(event:any) {
    // debugger;
    this.selectedOption = event?.value;
    if (this.selectedOption != 'olevel') {
      this.f['managementType'].setValue('');
      this.f['applyFrom'].setValue('');
    }
    console.log('Selected Option:', this.selectedOption);
  }
  onLeveltypeChange(event:any) {
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
  onApplyFromChange(event:any) {
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
      obtainedMarks: [null, [Validators.required,Validators.maxLength(5)]],
      totalMarks: [null, [Validators.required,Validators.maxLength(5)]],
      managementType: [null, Validators.required], // Optional, initially null
      applyFrom: [null, Validators.required],
      awardingInstitution: ['', Validators.required],
      obtainedMarksGrd9And10: [null, Validators.required],
      totalMarksGrd9And10: [null, Validators.required],
      subjectPairs: ['', Validators.required],
      subject: [''],
      subjectGrade: [''],
    });
    this.form.setValidators(this.marksValidator());
    this.createSubjectInitialDropdown();
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
        subject: [defaultSubjectValue, Validators.required], // Default subject value (change as needed)
        subjectGrade: ['', Validators.required],
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
        this.isRequired = [Validators.required];
      } else {
        this.isRequired = i < 5 ? [Validators.required] : [];
        defaultSubjectValue = i < 5 ? this.defaultSubjects[i].title : '';
      }
      const subjectPair = this.fb.group({
        subject: [defaultSubjectValue,this.isRequired], // Default subject value (change as needed)
        subjectGrade: ['',this.isRequired],
      });
      this.subjectPairs.push(subjectPair);
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

  checkMarks(event:any){
    debugger
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

    // Custom validator for "Obtained Marks"
    obtainedMarksValidator(): ValidatorFn {
      debugger
      return (control: AbstractControl): ValidationErrors | null => {
        const obtainedMarks = control.value;
        const totalMarks = this.form.get('totalMarks').value;
  
        if (obtainedMarks > totalMarks) {
          return { obtainedMarksGreaterThanTotalMarks: true };
        }
  
        return null;
      };
    }
  
    // Custom validator for "Total Marks"
    totalMarksValidator(): ValidatorFn {
      debugger
      return (control: AbstractControl): ValidationErrors | null => {
        const totalMarks = control.value;
        const obtainedMarks = this.form.get('obtainedMarks').value;
  
        if (totalMarks < obtainedMarks) {
          return { totalMarksLessThanObtainedMarks: true };
        }
  
        return null;
      };
    }

    marksValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        debugger
        const obtainedMarks = control.get('obtainedMarks').value;
        const totalMarks = control.get('totalMarks').value;

        if (obtainedMarks > totalMarks) {
          return { marksMismatch: true };
        }   
        return null;
      };
    }

    marksGrd9And10Validator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        debugger
        const obtainedMarksGrd9And10 = control.get('obtainedMarksGrd9And10').value;
        const totalMarksGrd9And10 = control.get('totalMarksGrd9And10').value;
    
        if(obtainedMarksGrd9And10 > totalMarksGrd9And10) {
          return { marksGrd9And10Mismatch: true };
        }    
        return null;
      };
    }

    validateMarks(obtainedMarksControlName: string, totalMarksControlName: string): void {
      debugger
      const obtainedMarksControl = this.form.get(obtainedMarksControlName);
      const totalMarksControl = this.form.get(totalMarksControlName);
  
      if (obtainedMarksControl.value > totalMarksControl.value) {
        obtainedMarksControl.setErrors({ marksMismatch: true });
      } else {
        obtainedMarksControl.setErrors(null);
      }
    }


}




// export class DropdownFloatlabelDemo implements OnInit {
//   form: FormGroup;
//   selectedOption: string;
//   selectedLevelOption: string;
//   selectedApplyFromOption: string;
//   educationTypeOptions: SelectItem[];
//   subjectGradeOptions: SelectItem[];
//   subjectOptions: SelectItem[];
//   managementTypeOptions: SelectItem[];
//   boardNameOptions: SelectItem[];
//   groupNameOptions: SelectItem[];
//   applyFromOptions: SelectItem[];
//   // Define an array of form controls for subjects
//   subjectControls: FormControl[] = [];
//   // Define an array of form controls for subject grades
//   subjectGradeControls: FormControl[] = [];
//   subjectPairs: FormGroup[] = [];
//   allProgramSubjectPairsBackup: FormGroup[] = [];
//   managementSubjectPairsBackup: FormGroup[] = [];

//   defaultSubjects = [
//     { id: 2187, title: 'Bio/CS/IT ', description: 'Bio/CS/IT' },
//     { id: 2191, title: 'Chemistry', description: 'Chemistry' },
//     { id: 2198, title: 'English Language', description: 'English Language' },
//     { id: 2222, title: 'Mathematics', description: 'Mathematics' },
//     { id: 2227, title: 'Physics', description: 'Physics' },
//     { id: 2226, title: 'Pakistan Studies', description: 'Pakistan Studies' },
//     { id: 2240, title: 'Urdu', description: 'Urdu' },
//     { id: 2217, title: 'Islamiyat', description: 'Islamiyat' },
//   ];

//   constructor(private fb: FormBuilder, private http: HttpClient) {}
//   ngOnInit() {
//     this.bindMatricForm();
//     this.getSubjectList();
//     this.educationTypeOptions = [
//       { label: 'Matric', value: 'matric' },
//       { label: 'O-Level', value: 'olevel' },
//       { label: 'American High School System', value: 'american' },
//     ];

//     this.managementTypeOptions = [
//       { label: 'Management Science Only', value: 'management' },
//       { label: 'All Programs', value: 'all' },
//     ];
//     this.boardNameOptions = [
//       { label: 'Mardan', value: 'mardan' },
//       { label: 'Peshawar', value: 'peshawar' },
//       { label: 'Swat', value: 'swat' },
//       { label: 'Islamabad', value: 'islamabad' },
//     ];
//     this.groupNameOptions = [
//       { label: 'Science', value: 'science' },
//       { label: 'Arts', value: 'arts' },
//       { label: 'Humanities', value: 'humanities' },
//     ];
//     this.subjectGradeOptions = [
//       { label: 'A+', value: 'A+' },
//       { label: 'A', value: 'A' },
//       { label: 'B', value: 'B' },
//       { label: 'C', value: 'C' },
//       // Add more options as needed
//     ];
//     this.applyFromOptions = [
//       { label: 'Pakistan', value: 'pak' },
//       { label: 'Overseas', value: 'overseas' },
//       { label: 'Covid 19', value: 'covid' },
//     ];
//   }

//   get f() {
//     return this.form.controls;
//   }

//   getSubjectList() {
//     this.http.get('assets/dropdownList.json').subscribe((data: any) => {
//       this.subjectOptions = data.oLevelSubject;
//       console.log(this.subjectOptions); // Log the JSON data to the console
//     });
//   }

//   onDropdownChange(event) {
//     // debugger;
//     this.selectedOption = event?.value;
//     if (this.selectedOption != 'olevel') {
//       this.f['managementType'].setValue('');
//       this.f['applyFrom'].setValue('');
//     }
//     console.log('Selected Option:', this.selectedOption);
//   }
//   onLeveltypeChange(event) {
//     debugger;
//     this.selectedLevelOption = event?.value;
//     this.f['managementType'].setValue(event?.value);
//     if (
//       event?.value == 'all' &&
//       (this.f['applyFrom'].value == '' || this.f['applyFrom'].value == null)
//     ) {
//       this.f['applyFrom'].setValue('');
//       this.selectedApplyFromOption = '';
//     } else {
//       this.createSubjectInitialDropdown();
//       // this.resetSubjectGradeValue();
//     }
//     console.log('Selected Level Option:', this.selectedLevelOption);
//   }
//   onApplyFromChange(event) {
//     this.selectedApplyFromOption = event?.value;
//     this.f['applyFrom'].setValue(event?.value);
//     this.createSubjectDropdownForAllProgram(this.selectedApplyFromOption);
//     console.log('Selected Apply From Option:', this.selectedApplyFromOption);
//   }
//   bindMatricForm() {
//     this.form = this.fb.group({
//       educationType: ['', Validators.required], // Default to 'matric'
//       boardName: ['', Validators.required],
//       groupName: ['', Validators.required],
//       obtainedMarks: [null, Validators.required],
//       totalMarks: [null, Validators.required],
//       managementType: [null], // Optional, initially null
//       applyFrom: [null],
//       awardingInstitution: [''],
//       obtainedMarksGrd9And10: [null],
//       totalMarksGrd9And10: [null],
//       subjectPairs: [''],
//       subject: [''],
//       subjectGrade: [''],
//     });
//     // this.createSubjectInitialDropdown();
//   }
//   createSubjectInitialDropdown() {
//     this.subjectPairs = [];
//     // Create eight pairs of form controls for subjects and subject grades
//     for (let i = 0; i < 8; i++) {
//       // Set a default subject value from the defaultSubjects array
//       const defaultSubjectValue = this.defaultSubjects[i]
//         ? this.defaultSubjects[i].title
//         : '';
//       const subjectPair = this.fb.group({
//         subject: [defaultSubjectValue], // Default subject value (change as needed)
//         subjectGrade: [''],
//       });
//       this.subjectPairs.push(subjectPair);
//       // const defaultSubjectValue = this.defaultSubjects[i] ? this.defaultSubjects[i].title : '';
//       // this.subjectControls.push(this.fb.control(defaultSubjectValue));
//       // this.subjectGradeControls.push(this.fb.control(''));
//     }
//   }
//   createSubjectDropdownForAllProgram(applyFrom: string = '') {
//     this.subjectPairs = [];
//     // Create eight pairs of form controls for subjects and subject grades
//     for (let i = 0; i < 8; i++) {
//       // Set a default subject value from the defaultSubjects array
//       let defaultSubjectValue = '';
//       if (applyFrom === 'pak') {
//         defaultSubjectValue = this.defaultSubjects[i]
//           ? this.defaultSubjects[i].title
//           : '';
//       } else {
//         defaultSubjectValue = i < 5 ? this.defaultSubjects[i].title : '';
//       }
//       const subjectPair = this.fb.group({
//         subject: [defaultSubjectValue], // Default subject value (change as needed)
//         subjectGrade: [''],
//       });
//       this.subjectPairs.push(subjectPair);
//       // const defaultSubjectValue = this.defaultSubjects[i] ? this.defaultSubjects[i].title : '';
//       // this.subjectControls.push(this.fb.control(defaultSubjectValue));
//       // this.subjectGradeControls.push(this.fb.control(''));
//     }
//   }

//   onSubmit() {
//     debugger;
//     const type = this.f['educationType'].value;
//     // Convert and store subjectPairs as a JSON string
//     this.f['subjectPairs'].setValue(
//       JSON.stringify(this.subjectPairs.map((pair) => pair.value))
//     );
//     // Log the value (for testing)
//     console.log('Subject Pairs JSON:', this.f['subjectPairs'].value);
//     console.log(
//       'Subject Pairs JSON:',
//       JSON.stringify(this.f['subjectPairs'].value)
//     );
//     console.log(
//       'Subject Pairs:',
//       this.subjectPairs.map((pair) => pair.value)
//     );

//     this.resetFormValues(type);
//     console.log('Form Value:', this.form.value);
//     if (this.form.valid) {
//       console.log(this.form.value);
//     }
//   }

//   resetSubjectGradeValue() {
//     this.subjectPairs.map((pair) => (pair.value.subjectGrade = ''));
//   }

//   resetFormValues(type: string) {
//     switch (type) {
//       case 'matric':
//         this.f['subjectPairs'].setValue(null);
//         this.f['awardingInstitution'].setValue(null);
//         this.f['obtainedMarksGrd9And10'].setValue(null);
//         this.f['totalMarksGrd9And10'].setValue(null);
//         break;
//       case 'olevel':
//         // for matric
//         this.f['awardingInstitution'].setValue(null);
//         this.f['obtainedMarksGrd9And10'].setValue(null);
//         this.f['totalMarksGrd9And10'].setValue(null);
//         // for american school system
//         this.f['boardName'].setValue(null);
//         this.f['groupName'].setValue(null);
//         this.f['obtainedMarks'].setValue(null);
//         this.f['totalMarks'].setValue(null);
//         break;
//       case 'american':
//         this.f['subjectPairs'].setValue(null);
//         this.f['boardName'].setValue(null);
//         this.f['groupName'].setValue(null);
//         this.f['obtainedMarks'].setValue(null);
//         this.f['totalMarks'].setValue(null);
//         break;
//       default:
//         break;
//     }
//   }
// }
