import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendFriendsComponent } from './friend-friends.component';

describe('FriendFriendsComponent', () => {
  let component: FriendFriendsComponent;
  let fixture: ComponentFixture<FriendFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
