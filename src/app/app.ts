import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Records } from './services/records';
import { FormRecord, Department } from './models/form-record';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private recordsService = inject(Records);
  private fb = inject(FormBuilder);

  records = this.recordsService.getAll();

  form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{1,4}$/)]],
    arabicName: [
      '',
      [Validators.required, Validators.pattern(/^[\u0600-\u06FF\s]+$/)]
    ],
    englishName: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]
    ],
    department: ['', Validators.required],
    submissionDeadline: ['', Validators.required]
  });

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    if (new Date(value.submissionDeadline) < new Date()) {
      this.form.controls.submissionDeadline.setErrors({ past: true });
      return;
    }

    this.records.subscribe(records => {
      const codeExists = records.some(
        record => record.code === value.code
      );

      if (codeExists) {
        this.form.controls.code.setErrors({ unique: true });
        return;
      }

      const duplicate = records.some(
        record =>
          record.code === value.code &&
          record.arabicName === value.arabicName &&
          record.englishName === value.englishName &&
          record.department === value.department &&
          record.submissionDeadline === value.submissionDeadline
      );

      if (duplicate) {
        this.form.setErrors({ duplicate: true });
        return;
      }

      const record: FormRecord = {
        id: 0,
        code: value.code,
        arabicName: value.arabicName,
        englishName: value.englishName,
        department: value.department as Department,
        submissionDeadline: value.submissionDeadline,
        createdAt: new Date().toISOString()
      };

      this.recordsService.create(record).subscribe(() => {
        this.records = this.recordsService.getAll();
        this.form.reset();
      });
    });
  }
}