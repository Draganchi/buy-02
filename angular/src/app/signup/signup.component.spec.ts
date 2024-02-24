import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['sendSignupRequest', 'sendLoginRequest']) },
        { provide: StateService, useValue: jasmine.createSpyObj('StateService', ['refreshState']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    stateService = TestBed.inject(StateService);
    router = TestBed.inject(Router);

 // beforeEach(() => {
    // Correct mock for UserService
   spyOn(userService, 'sendSignupRequest').and.returnValue(of({
     name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword',
      id: '1',
      role: 'CLIENT',
    }));

    // Correct mock for UserService's login method
   spyOn(userService, 'sendLoginRequest').and.returnValue(of({
     name: 'Test User',
     email: 'test@example.com',
     id: '1',
    role: 'CLIENT'
    }));

    spyOn(stateService, 'refreshState').and.callThrough();
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
//});


