import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifnutriComponent } from './modifnutri.component';

describe('ModifnutriComponent', () => {
  let component: ModifnutriComponent;
  let fixture: ComponentFixture<ModifnutriComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifnutriComponent]
    });
    fixture = TestBed.createComponent(ModifnutriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
