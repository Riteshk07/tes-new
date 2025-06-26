import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepperStep {
  label: string;
  completed: boolean;
  optional?: boolean;
  valid: boolean;
}

@Component({
  selector: 'app-stepper-step',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StepperStepComponent {
  @Input() label: string = '';
  @Input() completed: boolean = false;
  @Input() optional: boolean = false;
  @Input() valid: boolean = true;
  @Input() stepControl: any;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterContentInit {
  @Input() linear: boolean = true;
  @Input() selectedIndex: number = 0;
  
  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() stepChange = new EventEmitter<{ selectedIndex: number, previousIndex: number }>();

  @ContentChildren(StepperStepComponent) steps!: QueryList<StepperStepComponent>;

  stepList: StepperStepComponent[] = [];

  ngAfterContentInit() {
    this.stepList = this.steps.toArray();
  }

  get currentStep(): StepperStepComponent | undefined {
    return this.stepList[this.selectedIndex];
  }

  next(): void {
    if (this.canGoToNext()) {
      this.goToStep(this.selectedIndex + 1);
    }
  }

  previous(): void {
    if (this.canGoToPrevious()) {
      this.goToStep(this.selectedIndex - 1);
    }
  }

  goToStep(index: number): void {
    if (this.canGoToStep(index)) {
      const previousIndex = this.selectedIndex;
      this.selectedIndex = index;
      this.selectedIndexChange.emit(this.selectedIndex);
      this.stepChange.emit({ selectedIndex: this.selectedIndex, previousIndex });
    }
  }

  canGoToNext(): boolean {
    return this.selectedIndex < this.stepList.length - 1 && this.isCurrentStepValid();
  }

  canGoToPrevious(): boolean {
    return this.selectedIndex > 0;
  }

  canGoToStep(index: number): boolean {
    if (index < 0 || index >= this.stepList.length) {
      return false;
    }

    if (!this.linear) {
      return true;
    }

    // In linear mode, can only go to next step if current is valid
    // or can go to any previous step
    if (index <= this.selectedIndex) {
      return true;
    }

    // Can only go forward if current step is valid
    return this.isCurrentStepValid();
  }

  private isCurrentStepValid(): boolean {
    const currentStep = this.currentStep;
    if (!currentStep) return true;

    if (currentStep.stepControl) {
      return currentStep.stepControl.valid;
    }

    return currentStep.valid;
  }

  isStepCompleted(index: number): boolean {
    const step = this.stepList[index];
    if (!step) return false;

    if (step.stepControl) {
      return step.stepControl.valid && index < this.selectedIndex;
    }

    return step.completed || index < this.selectedIndex;
  }

  getStepState(index: number): 'active' | 'completed' | 'invalid' | 'pending' {
    if (index === this.selectedIndex) {
      return this.isCurrentStepValid() ? 'active' : 'invalid';
    }

    if (this.isStepCompleted(index)) {
      return 'completed';
    }

    return 'pending';
  }
}