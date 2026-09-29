import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate the requested count of items', () => {
    fixture.componentRef.setInput('count', 4);
    fixture.detectChanges();

    expect(component.items.length).toBe(4);
    const elements = fixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(elements.length).toBe(4);
  });

  it('should render circle skeleton when type is circle', () => {
    fixture.componentRef.setInput('type', 'circle');
    fixture.detectChanges();

    const circle = fixture.nativeElement.querySelector('.rounded-full');
    expect(circle).toBeTruthy();
  });

  it('should render card skeleton when type is card', () => {
    fixture.componentRef.setInput('type', 'card');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.rounded-2xl');
    expect(card).toBeTruthy();
  });
});
