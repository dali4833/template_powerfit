import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubsPacksComponent } from './clubs-packs.component';

describe('ClubsPacksComponent', () => {
  let component: ClubsPacksComponent;
  let fixture: ComponentFixture<ClubsPacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubsPacksComponent]
    });
    fixture = TestBed.createComponent(ClubsPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
