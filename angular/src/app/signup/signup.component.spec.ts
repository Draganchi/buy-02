import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../service/user.service';
import { StateService } from '../service/state.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

// Mock services
class MockUserService {
  sendSignupRequest(request: any) {
    return of(null); // Simulate successful signup
  }
  sendLoginRequest(request: any) {
    return of({ jwtToken: 'fake-jwt-token', user: { name: 'Test User' } }); // Simulate successful login
  }
}

class MockStateService {
  refreshState(token: string, user: any) {}
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userService: UserService;
  let stateService: StateService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: StateService, useClass: MockStateService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userService = TestBed.inject(UserService);
    stateService = TestBed.inject(StateService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  // Add more tests here to check for form validity, field errors, and custom validator
  // For example, checking the password and confirmPassword fields match

  it('passwords match validator', () => {
    let password = component.registerForm.controls['password'];
    let confirmPassword = component.registerForm.controls['confirmPassword'];
    password.setValue('123456');
    confirmPassword.setValue('123456');
    // Trigger the custom validator
    component.registerForm.updateValueAndValidity();
    expect(component.registerForm.errors?.['notSame']).toBeUndefined();
  });

  it('submitting a valid form', () => {
     spyOn(userService, 'sendLoginRequest').and.returnValue(of({ 
      name: 'Test User',
      password: 'testPassword'
     }
    }));
    spyOn(userService, 'sendSignupRequest').and.returnValue(of({
     name: 'New User',
     email: 'newuser@example.com',
     password:'123456',
     role: 'Client'
    }));
    spyOn(stateService, 'refreshState').and.callThrough();
    const navigateSpy = spyOn(router, 'navigate');

    component.registerForm.controls['name'].setValue('testuser');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('123456');
    component.registerForm.controls['confirmPassword'].setValue('123456');
    component.registerForm.controls['role'].setValue(true); // Assuming true maps to 'SELLER'
    component.onSubmit();

    // Verify that the signup request was made with the correct role
    expect(userService.sendSignupRequest).toHaveBeenCalledWith(jasmine.objectContaining({ role: 'SELLER' }));
    // Verify that after signup, an automatic login attempt is made
    expect(userService.sendLoginRequest).toHaveBeenCalledTimes(1);
    // Check if the navigation to the 'home' route was triggered
    expect(navigateSpy).toHaveBeenCalledWith(['home'], jasmine.any(Object));
  });

  // You can add more tests to simulate and verify form submission errors, 
  // checking if the error message is set correctly, etc.
});
