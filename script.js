document.getElementById('generateBtn').addEventListener('click', generatePassword);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('themeSwitcher').addEventListener('click', switchTheme);
document.getElementById('downloadHistoryBtn').addEventListener('click', downloadHistory);

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

    let charset = '';
    if (includeUppercase) charset += customUppercase || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += customLowercase || 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += customNumbers || '0123456789';
    if (includeSpecial) charset += customSpecial || '!@#$%^&*()_+[]{}|;:,.<>?';

    if (charset === '') {
        alert('Please select at least one character set');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

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
    const strengthFeedback = document.getElementById('strengthFeedback');
    let strength = 0;
    let feedback = 'Your password should contain: ';

    const lengthCriteria = password.length >= 12;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCriteria = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

    if (lengthCriteria) {
        strength++;
        feedback += '• At least 12 characters long. ';
    } else {
        feedback += '• More characters. ';
    }

    if (uppercaseCriteria) {
        strength++;
        feedback += '• Uppercase letters. ';
    } else {
        feedback += '• Uppercase letters. ';
    }

    if (lowercaseCriteria) {
        strength++;
        feedback += '• Lowercase letters. ';
    } else {
        feedback += '• Lowercase letters. ';
    }

    if (numberCriteria) {
        strength++;
        feedback += '• Numbers. ';
    } else {
        feedback += '• Numbers. ';
    }

    if (specialCriteria) {
        strength++;
        feedback += '• Special characters. ';
    } else {
        feedback += '• Special characters. ';
    }

    strengthMeter.value = strength;
    strengthFeedback.textContent = feedback;
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

function downloadHistory() {
    const historyText = passwordHistory.join('\n');
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password_history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
