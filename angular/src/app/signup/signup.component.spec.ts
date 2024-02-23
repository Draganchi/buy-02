import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';
import { UserService } from '../service/user.service';
import { StateService } from '../service/state.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userService: UserService;
  let stateService: StateService;
  let router: Router;

// Inside your beforeEach block or at the top of your test file
 beforeEach(() => {
  userService = TestBed.inject(UserService);
  stateService = TestBed.inject(StateService);
  router = TestBed.inject(Router);

  // Correct mock for UserService
  spyOn(userService, 'sendSignupRequest').and.returnValue(of({
    jwtToken: 'fake-jwt-token',
    user: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword', // Adjust based on your User interface
      id: '1',
      role: 'CLIENT',
      // Add any other properties as required by the User interface
    }
  }));

  // Correct mock for UserService's login method
  spyOn(userService, 'sendLoginRequest').and.returnValue(of({
    jwtToken: 'fake-jwt-token',
    user: {
      name: 'Test User',
      email: 'test@example.com',
      id: '1',
      role: 'CLIENT'
    }
  }));
});


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be valid when filled out correctly', () => {
    component.registerForm.controls['name'].setValue('Test User');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['confirmPassword'].setValue('password123');
    component.registerForm.controls['role'].setValue(false); // Assuming false maps to 'CLIENT'
    component.onValidate();
    expect(component.formValid).toBeTrue();
  });

it('should submit form and auto-login', () => {
  const signupRequest = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    role: false // Assuming false maps to 'CLIENT'
  };

  // Set form values
  component.registerForm.controls['name'].setValue(signupRequest.name);
  component.registerForm.controls['email'].setValue(signupRequest.email);
  component.registerForm.controls['password'].setValue(signupRequest.password);
  component.registerForm.controls['confirmPassword'].setValue(signupRequest.confirmPassword);
  component.registerForm.controls['role'].setValue(signupRequest.role);

  // Spy on the StateService and Router methods
  const stateServiceSpy = spyOn(stateService, 'refreshState').and.callThrough();
  const routerSpy = spyOn(router, 'navigate');

  component.onSubmit();

  // Verify service calls
  expect(userService.sendSignupRequest).toHaveBeenCalledWith(jasmine.objectContaining({ role: 'CLIENT' }));
  expect(userService.sendLoginRequest).toHaveBeenCalledWith(jasmine.objectContaining({ role: 'CLIENT' }));

  // Verify navigation
  expect(routerSpy).toHaveBeenCalledWith(['home'], jasmine.any(Object));
});


