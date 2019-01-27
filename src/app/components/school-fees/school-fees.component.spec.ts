import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolFeesComponent } from './school-fees.component';

describe('SchoolFeesComponent', () => {
  let component: SchoolFeesComponent;
  let fixture: ComponentFixture<SchoolFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
