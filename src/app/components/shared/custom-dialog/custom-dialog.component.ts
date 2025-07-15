import { NgClass, NgIf, NgStyle } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css'],
  standalone: true,
  imports: [NgIf, NgStyle]
})
export class CustomDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() className = '';
  @Input() style: Record<string, any> = {};
  @Input() closeOnOutsideClick = false;
  @Input() closeOnEsc = true;
  @Input() header!: string | HTMLElement;
  @Input() footer!: string | HTMLElement;
  @Output() onClose = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      document.body.style.overflow = this.open ? 'hidden' : 'unset';
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.open && this.closeOnEsc && event.key === 'Escape') {
      this.onClose.emit();
    }
  }

  onOverlayClick(event: MouseEvent) {
    if (
      this.closeOnOutsideClick &&
      event.target === this.elementRef.nativeElement.querySelector('.dialogOverlay')
    ) {
      this.onClose.emit();
    }
  }
}
