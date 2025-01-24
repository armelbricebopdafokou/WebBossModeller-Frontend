import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LDAPComponent } from './ldap.component';

describe('LDAPComponent', () => {
  let component: LDAPComponent;
  let fixture: ComponentFixture<LDAPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LDAPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LDAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
