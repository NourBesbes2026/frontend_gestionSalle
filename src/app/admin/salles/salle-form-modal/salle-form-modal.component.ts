import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Salle, SalleFormValue, StatutSalle } from '../../../models/salle.model';

@Component({
  selector: 'app-salle-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './salle-form-modal.component.html',
  styleUrl: './salle-form-modal.component.scss',
})
export class SalleFormModalComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() open = false;
  @Input() salle: Salle | null = null;
  @Input() saving = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<SalleFormValue>();

  readonly statutOptions: StatutSalle[] = ['DISPONIBLE', 'RESERVEE', 'EN_MAINTENANCE'];
  equipementInput = '';

  readonly form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    capacite: [10, [Validators.required, Validators.min(1)]],
    statut: ['DISPONIBLE' as StatutSalle, Validators.required],
    equipements: this.fb.nonNullable.control<string[]>([]),
  });

  ngOnChanges(): void {
    if (this.salle) {
      this.form.patchValue({
        nom: this.salle.nom,
        capacite: this.salle.capacite,
        statut: this.salle.statut,
        equipements: this.salle.equipements,
      });
    } else {
      this.form.reset({ nom: '', capacite: 10, statut: 'DISPONIBLE', equipements: [] });
    }
  }

  addEquipement(): void {
    const value = this.equipementInput.trim();
    if (!value) return;
    const current = this.form.controls.equipements.value;
    if (!current.includes(value)) {
      this.form.controls.equipements.setValue([...current, value]);
    }
    this.equipementInput = '';
  }

  removeEquipement(item: string): void {
    this.form.controls.equipements.setValue(this.form.controls.equipements.value.filter((e) => e !== item));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }
}
