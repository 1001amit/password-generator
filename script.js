document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSpecial = document.getElementById('special').checked;

    if (length < 4 || length > 32) {
        alert('Password length must be between 4 and 32 characters.');
        return;
    }

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let allChars = '';
    let password = '';

    if (includeUppercase) {
        allChars += uppercaseChars;
        password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    }
    if (includeLowercase) {
        allChars += lowercaseChars;
        password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    }
    if (includeNumbers) {
        allChars += numberChars;
        password += numberChars[Math.floor(Math.random() * numberChars.length)];
    }
    if (includeSpecial) {
        allChars += specialChars;
        password += specialChars[Math.floor(Math.random() * specialChars.length)];
    }

    if (allChars === '') {
        alert('Please select at least one character type');
        return;
    }

    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }

    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    document.getElementById('result').value = password;
    updateStrengthMeter(password);
}

function copyToClipboard() {
    const resultInput = document.getElementById('result');
    resultInput.select();
    document.execCommand('copy');
    alert('Password copied to clipboard');
}

function updateStrengthMeter(password) {
    const strengthMeter = document.getElementById('strength');
    let strength = 0;
    const lengthCriteria = password.length >= 12;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCriteria = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

    if (lengthCriteria) strength++;
    if (uppercaseCriteria) strength++;
    if (lowercaseCriteria) strength++;
    if (numberCriteria) strength++;
    if (specialCriteria) strength++;

    strengthMeter.value = strength;
}

