import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOwnerComponent } from './register-owner.component';

describe('RegisterOwnerComponent', () => {
  let component: RegisterOwnerComponent;
  let fixture: ComponentFixture<RegisterOwnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterOwnerComponent]
    });
    fixture = TestBed.createComponent(RegisterOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
