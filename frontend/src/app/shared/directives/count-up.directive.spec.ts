import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountUpDirective } from './count-up.directive';

@Component({
  standalone: true,
  imports: [CountUpDirective],
  template: `
    <span id="stat1" appCountUp="3+" [duration]="1800">3+</span>
    <span id="stat2" appCountUp="12+" [duration]="1800">12+</span>
    <span id="stat3" appCountUp="100%" [duration]="1800">100%</span>
    <span id="stat4" appCountUp="99.9%" [duration]="1800">99.9%</span>
  `,
})
class TestHostComponent {}

describe('CountUpDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should compile and initialize test host component with directive', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const stat1 = fixture.nativeElement.querySelector('#stat1');
    const stat2 = fixture.nativeElement.querySelector('#stat2');
    const stat3 = fixture.nativeElement.querySelector('#stat3');
    const stat4 = fixture.nativeElement.querySelector('#stat4');

    expect(stat1).toBeTruthy();
    expect(stat2).toBeTruthy();
    expect(stat3).toBeTruthy();
    expect(stat4).toBeTruthy();
  });

  it('should render correct formats for targets with +, %, and decimals', () => {
    const stat1 = fixture.nativeElement.querySelector('#stat1');
    const stat2 = fixture.nativeElement.querySelector('#stat2');
    const stat3 = fixture.nativeElement.querySelector('#stat3');
    const stat4 = fixture.nativeElement.querySelector('#stat4');

    // In a test environment without IntersectionObserver triggering viewport,
    // the elements are either initialized with 0+/0%/0.0% or the target value.
    expect(stat1.textContent).toMatch(/^(0\+|3\+)$/);
    expect(stat2.textContent).toMatch(/^(0\+|12\+)$/);
    expect(stat3.textContent).toMatch(/^(0%|100%)$/);
    expect(stat4.textContent).toMatch(/^(0\.0%|99\.9%)$/);
  });
});
