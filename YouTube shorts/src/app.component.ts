import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var html2canvas: any;

interface Palette {
  name: string;
  css: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent {
  @ViewChild('imagePreview') imagePreview!: ElementRef;

  // State Signals
  headline = signal<string>('هنا يكتب عنوان الخبر الرئيسي');
  newsBody = signal<string>('تفاصيل موجزة عن الخبر لجذب المشاهد. يجب أن تكون قصيرة وواضحة.');
  mainImageUrl = signal<string | null>('https://picsum.photos/720/720');
  logoImageUrl = signal<string | null>(null);
  
  // Style Signals
  headlineColor = signal<string>('#FFFFFF');
  headlineSize = signal<number>(40);
  newsBodyColor = signal<string>('#E0E0E0');
  newsBodySize = signal<number>(20);
  logoPosition = signal<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-right');
  logoSize = signal<number>(80);
  logoPadding = signal<number>(8);
  logoBorderRadius = signal<number>(12);
  
  // Font & Text Shadow Signals
  fontFamily = signal<string>('Cairo');
  headlineShadowColor = signal<string>('#000000');
  headlineShadowBlur = signal<number>(5);
  newsBodyShadowColor = signal<string>('#000000');
  newsBodyShadowBlur = signal<number>(3);

  isExporting = signal(false);
  
  placeholderLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgMjJWMk0yIDEyaDIwTTUuNSAxOC41QTkgOSAwIDAgMCAxMiAyMiA5IDkgMCAwIDAgMTguNSA1LjUiLz48cGF0aCBkPSJNNTUuNSA1LjVBNyA3IDAgMCAxIDEyIDIgNyA3IDAgMCAxIDE4LjUgMTguNSIvPjwvc3ZnPg==';

  palettes: WritableSignal<Palette[]> = signal([
    { name: 'أخبار العالم', css: `repeating-linear-gradient(0deg, rgba(125, 175, 255, 0.05), rgba(125, 175, 255, 0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(125, 175, 255, 0.05), rgba(125, 175, 255, 0.05) 1px, transparent 1px, transparent 40px), radial-gradient(ellipse at center, rgba(14, 29, 61, 1) 0%, rgba(12, 20, 39, 1) 100%)` },
    { name: 'عاجل وحيوي', css: 'radial-gradient(ellipse at top left, rgba(179, 58, 58, 0.7), transparent 60%), radial-gradient(ellipse at bottom right, rgba(36, 36, 128, 0.6), transparent 70%), #111217' },
    { name: 'تقني ومستقبلي', css: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)' },
    { name: 'ذهبي فاخر', css: 'radial-gradient(ellipse at bottom, rgba(212, 175, 55, 0.2), transparent 70%), #1a1a1a' },
    { name: 'أزرق هادئ', css: 'linear-gradient(45deg, #09203f 0%, #537895 100%)' },
    { name: 'غرافيت داكن', css: 'linear-gradient(160deg, #434343 0%, #1e1e1e 100%)' },
    { name: 'أحمر ناري', css: 'linear-gradient(135deg, #6d0000 0%, #d32f2f 74%)' },
    { name: 'موف غامض', css: 'linear-gradient(135deg, #311b92 0%, #7e57c2 100%)' },
    { name: 'فوشيا عصري', css: 'linear-gradient(45deg, #c51162 0%, #f50057 100%)' },
    { name: 'سيان حيوي', css: 'linear-gradient(45deg, #004d40 0%, #009688 100%)' }
  ]);
  activePalette = signal<Palette>(this.palettes()[0]);
  
  // Computed Signals for styles
  headlineTextShadow = computed(() => `0px 2px ${this.headlineShadowBlur()}px ${this.headlineShadowColor()}`);
  newsBodyTextShadow = computed(() => `0px 1px ${this.newsBodyShadowBlur()}px ${this.newsBodyShadowColor()}`);


  constructor() {
    this.logoImageUrl.set(this.placeholderLogo);
  }

  handleTextInput(event: Event, targetSignal: WritableSignal<string>) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    targetSignal.set(inputElement.value);
  }
  
  handleSelectInput(event: Event, targetSignal: WritableSignal<string>) {
    const inputElement = event.target as HTMLSelectElement;
    targetSignal.set(inputElement.value);
  }

  handleRangeInput(event: Event, targetSignal: WritableSignal<number>) {
    const inputElement = event.target as HTMLInputElement;
    targetSignal.set(Number(inputElement.value));
  }
  
  handleColorInput(event: Event, targetSignal: WritableSignal<string>) {
    const inputElement = event.target as HTMLInputElement;
    targetSignal.set(inputElement.value);
  }

  handleFile(event: Event, targetSignal: WritableSignal<string | null>) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        targetSignal.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  setLogoPosition(position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') {
    this.logoPosition.set(position);
  }

  setActivePalette(palette: Palette) {
    this.activePalette.set(palette);
  }

  getLogoPositionClasses(): string {
    const position = this.logoPosition();
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
    }
  }

  async exportImage() {
    if (!this.imagePreview) return;
    this.isExporting.set(true);
    try {
      const element = this.imagePreview.nativeElement;
      const canvas = await html2canvas(element, { 
          useCORS: true, 
          allowTaint: true,
          scale: 2 // Increase resolution for better quality
      });
      const link = document.createElement('a');
      link.download = `short-image-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (error) {
        console.error("Error exporting image:", error);
        alert("حدث خطأ أثناء تصدير الصورة. يرجى المحاولة مرة أخرى.");
    } finally {
        this.isExporting.set(false);
    }
  }
}