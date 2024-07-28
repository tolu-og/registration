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

  
});