import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalfolderComponent } from './medicalfolder.component';

describe('MedicalfolderComponent', () => {
  let component: MedicalfolderComponent;
  let fixture: ComponentFixture<MedicalfolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalfolderComponent]
    });
    fixture = TestBed.createComponent(MedicalfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
