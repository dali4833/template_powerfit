import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowmedicalfolderComponent } from './showmedicalfolder.component';

describe('ShowmedicalfolderComponent', () => {
  let component: ShowmedicalfolderComponent;
  let fixture: ComponentFixture<ShowmedicalfolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowmedicalfolderComponent]
    });
    fixture = TestBed.createComponent(ShowmedicalfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
