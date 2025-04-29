import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubPerformanceComponent } from './club-performance.component';

describe('ClubPerformanceComponent', () => {
  let component: ClubPerformanceComponent;
  let fixture: ComponentFixture<ClubPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubPerformanceComponent]
    });
    fixture = TestBed.createComponent(ClubPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
