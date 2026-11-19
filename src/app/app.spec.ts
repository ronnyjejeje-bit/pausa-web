
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the main layout', async () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('pausa-header')).toBeTruthy();
    expect(compiled.querySelector('pausa-footer')).toBeTruthy();
    expect(compiled.querySelector('pausa-toast-host')).toBeTruthy();
  });
});
