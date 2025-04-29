import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatemeetingComponent } from './updatemeeting.component';

describe('UpdatemeetingComponent', () => {
  let component: UpdatemeetingComponent;
  let fixture: ComponentFixture<UpdatemeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatemeetingComponent]
    });
    fixture = TestBed.createComponent(UpdatemeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
