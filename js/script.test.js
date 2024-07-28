const RegistrationForm = require('./script')

describe('RegistrationForm', () => {
  let registrationForm;
  let formElement;

  beforeEach(() => {
    // Set up a mock DOM environment
    document.body.innerHTML = `
      <form id="registrationForm">
        <input id="firstName" name="firstName" type="text">
        <input id="lastName" name="lastName" type="text">
        <input id="email" name="email" type="email">
        <input id="password" name="password" type="password">
        <input id="confirmPassword" name="confirmPassword" type="password">
        <button type="submit">Register</button>
        <div id="generalError"></div>
      </form>
    `;
    formElement = document.getElementById('registrationForm');
    registrationForm = new RegistrationForm(formElement);
  });

  test('initializes with correct elements', () => {
    expect(registrationForm.formElement).toBe(formElement);
    expect(registrationForm.firstName).toBeTruthy();
    expect(registrationForm.lastName).toBeTruthy();
    expect(registrationForm.email).toBeTruthy();
    expect(registrationForm.password).toBeTruthy();
    expect(registrationForm.confirmPassword).toBeTruthy();
    expect(registrationForm.submitButton).toBeTruthy();
    expect(registrationForm.generalErrorContainer).toBeTruthy();
  });

  test('sets loading state correctly', () => {
    registrationForm.setLoadingState(true);
    expect(registrationForm.submitButton.disabled).toBe(true);
    expect(registrationForm.submitButton.textContent).toBe('Submitting...');
    expect(registrationForm.formElement.querySelectorAll('input')[0].readOnly).toBe(true);

    registrationForm.setLoadingState(false);
    expect(registrationForm.submitButton.disabled).toBe(false);
    expect(registrationForm.submitButton.textContent).toBe('Register');
    expect(registrationForm.formElement.querySelectorAll('input')[0].readOnly).toBe(false);
  });


  test('clears error messages', () => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formElement.appendChild(errorElement);
    registrationForm.generalErrorContainer.textContent = 'An error occurred';
    registrationForm.generalErrorContainer.style.display = 'block';

    registrationForm.clearErrorMessages();

    expect(formElement.querySelectorAll('.error-message').length).toBe(0);
    expect(registrationForm.generalErrorContainer.textContent).toBe('');
    expect(registrationForm.generalErrorContainer.style.display).toBe('none');
  });

  
  test('displays field-specific errors', () => {
    const errors = {
      firstName: 'First name is required',
      email: 'Invalid email format'
    };

    registrationForm.displayErrors(errors);

    const firstNameError = formElement.querySelector('#firstName + .error-message');
    const emailError = formElement.querySelector('#email + .error-message');

    expect(firstNameError).toBeTruthy();
    expect(firstNameError.textContent).toBe('First name is required');
    expect(emailError).toBeTruthy();
    expect(emailError.textContent).toBe('Invalid email format');
  });
  
});