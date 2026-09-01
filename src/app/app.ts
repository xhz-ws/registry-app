import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Records } from './services/records';
import { FormRecord, Department } from './models/form-record';
import {
  arabicOnlyValidator,
  englishOnlyValidator,
  futureDateValidator
} from './validators/form-record.validators';

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

  editingId: string | null = null;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    code: [
      '',
      [Validators.required, Validators.pattern(/^\d{1,4}$/)]
    ],
    arabicName: [
      '',
      [Validators.required, arabicOnlyValidator()]
    ],
    englishName: [
      '',
      [Validators.required, englishOnlyValidator()]
    ],
    department: [
      '',
      Validators.required
    ],
    submissionDeadline: [
      '',
      [Validators.required, futureDateValidator()]
    ]
  });

  startEdit(record: FormRecord): void {
    this.editingId = record.id;
    this.errorMessage = '';

    this.form.setValue({
      code: record.code,
      arabicName: record.arabicName,
      englishName: record.englishName,
      department: record.department,
      submissionDeadline: record.submissionDeadline.slice(0, 10)
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset();
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    this.records.subscribe(records => {
      const duplicateCode = records.some(
        record =>
          record.code === value.code &&
          record.id !== this.editingId
      );

      if (duplicateCode) {
        this.form.controls.code.setErrors({ unique: true });
        return;
      }

      const duplicateRecord = records.some(
        record =>
          record.id !== this.editingId &&
          record.code === value.code &&
          record.arabicName === value.arabicName &&
          record.englishName === value.englishName &&
          record.department === value.department &&
          record.submissionDeadline === value.submissionDeadline
      );

      if (duplicateRecord) {
        this.form.setErrors({ duplicate: true });
        return;
      }

      if (this.editingId !== null) {
        const existing = records.find(
          record => record.id === this.editingId
        );

        if (!existing) {
          return;
        }

        const updated: FormRecord = {
          ...existing,
          code: value.code,
          arabicName: value.arabicName,
          englishName: value.englishName,
          department: value.department as Department,
          submissionDeadline: value.submissionDeadline
        };

        this.recordsService.update(this.editingId, updated).subscribe({
          next: () => {
            this.records = this.recordsService.getAll();
            this.cancelEdit();
          },
          error: () => {
            this.errorMessage = 'Failed to save changes.';
          }
        });
      }
    });
  }
}