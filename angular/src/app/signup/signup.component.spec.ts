import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { UserService } from '../service/user.service';
import { StateService } from '../service/state.service';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userService: UserService;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['sendSignupRequest', 'sendLoginRequest']) },
        { provide: StateService, useValue: jasmine.createSpyObj('StateService', ['refreshState']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    stateService = TestBed.inject(StateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests will go here
});
it('should be invalid when empty', () => {
  expect(component.registerForm.valid).toBeFalsy();
});

it('should be valid when filled out correctly', () => {
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

  // Mock the UserService methods
  userService.sendSignupRequest.and.returnValue(of({ jwtToken: 'fake-jwt-token', user: { id: '1' } }));
  userService.sendLoginRequest.and.returnValue(of({ jwtToken: 'fake-jwt-token', user: { id: '1' } }));

  // Spy on the StateService and Router methods
  const stateServiceSpy = spyOn(stateService, 'refreshState').and.callThrough();
  const routerSpy = spyOn(component.router, 'navigate');

  component.registerForm.setValue(signupRequest);
  component.onSubmit();

  expect(userService.sendSignupRequest).toHaveBeenCalledWith({
    name: signupRequest.name,
    email: signupRequest.email,
    password: signupRequest.password,
    role: 'CLIENT'
  });
  expect(userService.sendLoginRequest).toHaveBeenCalledWith({
    name: signupRequest.name,
    email: signupRequest.email,
    password: signupRequest.password,
    role: 'CLIENT'
  });
  expect(stateServiceSpy).toHaveBeenCalled();
  expect(routerSpy).toHaveBeenCalledWith(['home']);
});
