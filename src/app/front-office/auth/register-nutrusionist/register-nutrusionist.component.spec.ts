import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNutrusionistComponent } from './register-nutrusionist.component';

describe('RegisterNutrusionistComponent', () => {
  let component: RegisterNutrusionistComponent;
  let fixture: ComponentFixture<RegisterNutrusionistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterNutrusionistComponent]
    });
    fixture = TestBed.createComponent(RegisterNutrusionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
