import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDetailsDialogComponent } from './archive-details-dialog.component';

describe('ArchiveDetailsDialogComponent', () => {
  let component: ArchiveDetailsDialogComponent;
  let fixture: ComponentFixture<ArchiveDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
