import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendAlbumComponent } from './friend-album.component';

describe('FriendAlbumComponent', () => {
  let component: FriendAlbumComponent;
  let fixture: ComponentFixture<FriendAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendAlbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
