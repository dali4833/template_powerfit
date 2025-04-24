import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaddComponent } from './editadd.component';

describe('EditaddComponent', () => {
  let component: EditaddComponent;
  let fixture: ComponentFixture<EditaddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditaddComponent]
    });
    fixture = TestBed.createComponent(EditaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
