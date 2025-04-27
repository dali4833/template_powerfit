import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionFrontComponent } from './promotion-front.component';

describe('PromotionFrontComponent', () => {
  let component: PromotionFrontComponent;
  let fixture: ComponentFixture<PromotionFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionFrontComponent]
    });
    fixture = TestBed.createComponent(PromotionFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
