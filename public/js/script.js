class RegistrationForm {
    constructor(formElement) {
        this.formElement = formElement;
        this.firstName = formElement.querySelector("#firstName");
        this.lastName = formElement.querySelector("#lastName");
        this.email = formElement.querySelector("#email");
        this.password = formElement.querySelector("#password");
        this.confirmPassword = formElement.querySelector("#confirmPassword");
        this.submitButton = formElement.querySelector("button");
        this.generalErrorContainer = formElement.querySelector("#generalError");
        this.init();
    }

    init() {
        this.formElement.addEventListener("submit", (event) => this.handleSubmit(event));
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setLoadingState(true);
        this.clearErrorMessages();
        
        try {
            const formData = new FormData(this.formElement);
            const jsonData = JSON.stringify(Object.fromEntries(formData));
            console.log("Sending data:", jsonData); // Log data being sent

            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });

            const result = await response.json();
            console.log("Received response:", result); // Log received response
            if (result.success) {
                this.displaySuccessMessage(result.email);
            } else {
                this.displayErrors(result.errors);
            }
        } catch (error) {
            console.error("Error:", error); // Log any errors
            this.displayGeneralError('An error occurred. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(isLoading) {
        this.submitButton.disabled = isLoading;
        this.submitButton.textContent = isLoading ? 'Submitting...' : 'Register';
        this.formElement.querySelectorAll('input').forEach(el => el.readOnly = isLoading);
    }

    clearErrorMessages() {
        const errorElements = this.formElement.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        this.generalErrorContainer.textContent = '';
        this.generalErrorContainer.style.display = 'none';
    }

    displayErrors(errors) {
        this.clearErrorMessages();
        for (const [field, message] of Object.entries(errors)) {
            const inputElement = this.formElement.querySelector(`#${field}`);
            if (inputElement) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'red';
                errorElement.textContent = message;
                inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
            }
        }
    }

    displayGeneralError(message) {
        this.generalErrorContainer.textContent = message;
        this.generalErrorContainer.style.display = 'block';
        this.generalErrorContainer.style.color = 'red';
    }

    displaySuccessMessage(email) {
        console.log("Displaying success message for email:", email);
        
        // Hide the registration form
        this.formElement.style.display = 'none';

        // Create and show a new form with a button
        const successForm = document.createElement('form');
        successForm.id = 'postRegistrationForm';
        successForm.innerHTML = `
            <h2>Registration Successful!</h2>
            <p>Thank you for registering, ${email}.</p>
            <button type="button" id="continueButton">Continue</button>
        `;
        
        // Insert the new form after the registration form
        this.formElement.parentNode.insertBefore(successForm, this.formElement.nextSibling);

        // Add event listener to the continue button
        document.getElementById('continueButton').addEventListener('click', () => {
            this.showOriginalForm();
        });
    }

    showOriginalForm() {
        // Remove the success message form
        document.getElementById('postRegistrationForm').remove();

        // Show the original registration form
        this.formElement.style.display = 'block';

        // Reset the form fields
        this.formElement.reset();

        // Reset the submit button
        this.submitButton.disabled = false;
        this.submitButton.textContent = 'Register';

        // Enable all input fields
        this.formElement.querySelectorAll('input').forEach(el => el.readOnly = false);

        // Clear any previous error messages
        this.clearErrorMessages();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formElement = document.getElementById("registrationForm");
    new RegistrationForm(formElement);
});

// Make it work in both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationForm;
} else if (typeof window !== 'undefined') {
    window.RegistrationForm = RegistrationForm;
}