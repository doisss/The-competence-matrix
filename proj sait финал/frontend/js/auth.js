/*
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
*/

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Переключение классов для анимации
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Функция регистрации
async function register(event) {
    event.preventDefault();
    const name = document.querySelector('.sign-up input[type="text"]').value;
    const email = document.querySelector('.sign-up input[type="email"]').value;
    const password = document.querySelector('.sign-up input[type="password"]').value;
    const dateOfBirth = document.querySelector('.sign-up input[type="date"]').value;
    console.log(dateOfBirth)
    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password,dateOfBirth })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Регистрация успешна');
        
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    
        const data = await response.json();
        
        console.log(data)
        
        if (response.ok) {
            
            
            // Можно перенаправить пользователя на другую страницу или сохранить токен
            // Например:
            const e=JSON.stringify(data.user_data)
    
            localStorage.setItem('user_data', e);
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }

        //container.classList.remove("active");
    } else {
        alert(data.message);
    }
}

function sleep(ms){
    return new Promise(resolve =>setTimeout(resolve,ms));
}
// Функция авторизации
async function login(event) {
    event.preventDefault();
    const email = document.querySelector('.sign-in input[type="email"]').value;
    const password = document.querySelector('.sign-in input[type="password"]').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    console.log(data)
    
    if (response.ok) {
        
        
        // Можно перенаправить пользователя на другую страницу или сохранить токен
        // Например:
        const e=JSON.stringify(data.user_data)

        localStorage.setItem('user_data', e);
        window.location.href = 'profile.html';
    } else {
        alert(data.message);
    }
}

// Добавляем слушатели на кнопки регистрации и авторизации
document.querySelector('.sign-up form').addEventListener('submit', register);
document.querySelector('.sign-in form').addEventListener('submit', login);