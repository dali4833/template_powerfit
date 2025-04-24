import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirnutriComponent } from './voirnutri.component';

describe('VoirnutriComponent', () => {
  let component: VoirnutriComponent;
  let fixture: ComponentFixture<VoirnutriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoirnutriComponent]
    });
    fixture = TestBed.createComponent(VoirnutriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
