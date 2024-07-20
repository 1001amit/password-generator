document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('themeSwitcher').addEventListener('click', switchTheme);

let passwordHistory = [];

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSpecial = document.getElementById('special').checked;

    const customUppercase = document.getElementById('customUppercase').value;
    const customLowercase = document.getElementById('customLowercase').value;
    const customNumbers = document.getElementById('customNumbers').value;
    const customSpecial = document.getElementById('customSpecial').value;

    if (length < 4 || length > 32) {
        alert('Password length must be between 4 and 32 characters.');
        return;
    }

    const defaultUppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const defaultLowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const defaultNumberChars = '0123456789';
    const defaultSpecialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const uppercaseChars = customUppercase || defaultUppercaseChars;
    const lowercaseChars = customLowercase || defaultLowercaseChars;
    const numberChars = customNumbers || defaultNumberChars;
    const specialChars = customSpecial || defaultSpecialChars;

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

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    document.getElementById('result').value = password;
    updateStrengthMeter(password);
    addToHistory(password);
    setExpiryReminder(password);
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

function addToHistory(password) {
    passwordHistory.push(password);
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = password;
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => copyPassword(password));
    listItem.appendChild(copyButton);
    historyList.appendChild(listItem);
}

function copyPassword(password) {
    const tempInput = document.createElement('input');
    tempInput.value = password;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Password copied to clipboard');
}

function switchTheme() {
    document.body.classList.toggle('dark-theme');
    document.querySelector('.container').classList.toggle('dark-theme');
}

function setExpiryReminder(password) {
    const expiryDays = parseInt(document.getElementById('expiryDays').value);
    if (isNaN(expiryDays) || expiryDays < 1) {
        return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const reminder = {
        password,
        expiryDate: expiryDate.toISOString()
    };

    const reminders = JSON.parse(localStorage.getItem('passwordReminders')) || [];
    reminders.push(reminder);
    localStorage.setItem('passwordReminders', JSON.stringify(reminders));

    alert(`Password expiry reminder set for ${expiryDays} day(s).`);
}

