import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendTimeComponent } from './friend-time.component';

describe('FriendTimeComponent', () => {
  let component: FriendTimeComponent;
  let fixture: ComponentFixture<FriendTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
