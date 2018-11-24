import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupConfrimComponent } from './signup-confrim.component';

describe('SignupConfrimComponent', () => {
  let component: SignupConfrimComponent;
  let fixture: ComponentFixture<SignupConfrimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupConfrimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupConfrimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
