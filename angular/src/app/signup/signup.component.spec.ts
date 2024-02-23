import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import { UserService } from '../service/user.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Setup spies for UserService and Router
    mockUserService = jasmine.createSpyObj('UserService', ['sendSignupRequest', 'sendLoginRequest']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Adjust the mock to return realistic data
    mockUserService.sendSignupRequest.and.returnValue(of({
      id: '123123123', // Assume your service returns an object with an 'id'
      name: 'john',
      email: 'john@gmail.com',
      role: 'SELLER', // No password or confirmPassword fields should be returned
    }));

    // Configure the testing module as usual
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
      role: false, // Assuming this boolean is correctly transformed in your component logic
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should call sendSignupRequest and navigate on successful signup', () => {
    // Set the form values directly, mimicking user input
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: false, // Again, assuming conversion logic in your component
    });

    // Simulate form submission
    component.onSubmit();

    // Check if the service was called with correctly transformed data
    expect(mockUserService.sendSignupRequest).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      role: 'CLIENT', // Expected role after boolean to role conversion
    });

    // Verify navigation was called
    expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
  });

  // Add more tests as needed...
});
