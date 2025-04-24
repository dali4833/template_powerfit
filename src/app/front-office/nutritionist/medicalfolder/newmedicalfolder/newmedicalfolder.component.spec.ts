import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmedicalfolderComponent } from './newmedicalfolder.component';

describe('NewmedicalfolderComponent', () => {
  let component: NewmedicalfolderComponent;
  let fixture: ComponentFixture<NewmedicalfolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewmedicalfolderComponent]
    });
    fixture = TestBed.createComponent(NewmedicalfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
