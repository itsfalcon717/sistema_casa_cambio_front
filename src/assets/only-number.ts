import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbers]',
  standalone: true, 
})
export class OnlyNumbersDirective {
  constructor(private ngControl: NgControl) {} 

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/\D/g, ''); 
    input.value = sanitizedValue;

   
    if (this.ngControl.control) {
      this.ngControl.control.setValue(sanitizedValue, { emitEvent: false });
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const sanitizedValue = text.replace(/\D/g, '').slice(0, 11); 

    const input = event.target as HTMLInputElement;
    input.value = sanitizedValue;

    if (this.ngControl.control) {
      this.ngControl.control.setValue(sanitizedValue, { emitEvent: false });
    }
  }
}
