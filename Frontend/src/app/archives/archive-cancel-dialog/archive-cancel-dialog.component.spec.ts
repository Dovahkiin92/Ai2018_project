import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveCancelDialogComponent } from './archive-cancel-dialog.component';

describe('ArchiveCancelDialogComponent', () => {
  let component: ArchiveCancelDialogComponent;
  let fixture: ComponentFixture<ArchiveCancelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveCancelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveCancelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
