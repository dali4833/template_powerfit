import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacknutritionistComponent } from './backnutritionist.component';

describe('BacknutritionistComponent', () => {
  let component: BacknutritionistComponent;
  let fixture: ComponentFixture<BacknutritionistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BacknutritionistComponent]
    });
    fixture = TestBed.createComponent(BacknutritionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
