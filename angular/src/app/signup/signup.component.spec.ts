import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import { UserService } from '../service/user.service';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['sendSignupRequest', 'sendLoginRequest']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be valid when filled with correct data', () => {
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: false,
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should call sendSignupRequest and navigate on successful signup', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: 'CLIENT',
    };
    mockUserService.sendSignupRequest.and.returnValue(of(user));

    component.registerForm.setValue(user);
    component.onSubmit();

    expect(mockUserService.sendSignupRequest).toHaveBeenCalledWith(jasmine.objectContaining({
      name: user.name,
      email: user.email,
      password: user.password,
      role: 'CLIENT', // Ensure this matches your component's expected behavior
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home'], jasmine.any(Object));
  });

  // Additional tests here...

});

