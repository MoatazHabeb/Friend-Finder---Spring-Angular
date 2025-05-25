import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendAboutComponent } from './friend-about.component';

describe('FriendAboutComponent', () => {
  let component: FriendAboutComponent;
  let fixture: ComponentFixture<FriendAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
