import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatemedicalfolderComponent } from './updatemedicalfolder.component';

describe('UpdatemedicalfolderComponent', () => {
  let component: UpdatemedicalfolderComponent;
  let fixture: ComponentFixture<UpdatemedicalfolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatemedicalfolderComponent]
    });
    fixture = TestBed.createComponent(UpdatemedicalfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
