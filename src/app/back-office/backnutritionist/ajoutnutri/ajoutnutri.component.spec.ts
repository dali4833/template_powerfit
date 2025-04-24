import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutnutriComponent } from './ajoutnutri.component';

describe('AjoutnutriComponent', () => {
  let component: AjoutnutriComponent;
  let fixture: ComponentFixture<AjoutnutriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutnutriComponent]
    });
    fixture = TestBed.createComponent(AjoutnutriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
