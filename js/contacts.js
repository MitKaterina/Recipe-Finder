
// Загрузка DOM-контента, чтобы убедиться, что все элементы доступны для работы
document.addEventListener('DOMContentLoaded', () => {
    
    // Инициализация EmailJS с публичным ключом (Public Key)
    // Это необходимо для того, чтобы отправлять email через EmailJS API с сайта
    emailjs.init('Smn1LwGJq3ohrBHdq'); // Замените 'Public Key' на ваш публичный ключ, полученный в EmailJS

    // Находим форму на странице по классу '.contact__form form'
    // Это форма, которую пользователь будет заполнять и отправлять
    const form = document.querySelector('.contact__form form');

    // Находим элемент для отображения уведомлений по его ID 'notification'
    // Этот элемент будет использоваться для показа сообщений пользователю, например, об успехе или ошибке
    const notification = document.getElementById('notification');

    // Добавляем обработчик события на отправку формы
    // Этот код будет выполняться каждый раз, когда пользователь нажимает кнопку "Submit" в форме
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузка страницы)

        // Получаем значения, введенные пользователем, из полей формы по их ID
        const name = document.getElementById('name').value; // Имя отправителя
        const email = document.getElementById('email').value; // Электронная почта 
        const message = document.getElementById('message').value; // Сообщение 

        // Проверяем, что все поля формы заполнены
        if (!name || !email || !message) {
            // Если хотя бы одно поле пустое, показываем уведомление об ошибке
            showNotification('Please fill in all fields of the form.', true); 
            return; // Останавливаем выполнение кода
        }

        // Проверяем, что поле email содержит символ '@'
        if (!email.includes('@')) {
            // Если email некорректен, показываем уведомление об ошибке
            showNotification('Please enter a valid email address.', true); 
            return; // Останавливаем выполнение кода
        }

        // Подготовка параметров для отправки через EmailJS
        // Эти параметры будут переданы в шаблон email
        const templateParams = {
            from_name: name, // Имя отправителя
            from_email: email, // Электронная почта отправителя
            message: message // Сообщение отправителя
        };

        // Отправка письма с помощью метода emailjs.send на EmailJS
        // 'Service ID' - идентификатор вашего сервиса в EmailJS
        // 'Template ID' - идентификатор вашего шаблона email в EmailJS
        emailjs.send('service_ynqynre', 'template_jhk6ttj', templateParams)
            .then((response) => { // .then()принимает response (ответ) от сервера
                // Если отправка прошла успешно
                console.log('SUCCESS!', response.status, response.text); // Успешный ответ
                // Показываем уведомление об успешной отправке пользователю
                //флаг false указывает, что это не ошибка
                showNotification('Congratulations! Your message has been sent successfully!', false); 
                form.reset(); // Сбрасываем форму, очищая все поля
            }, (error) => { // Если произошла ошибка при отправке
                console.log('FAILED...', error); // Логируем ошибку
                // Показываем уведомление об ошибке отправки пользователю
                showNotification('Unfortunately, the message could not be sent. Try again.', true); 
            });
    });

    // Функция для показа уведомлений пользователю
    function showNotification(message, isError) {
        notification.textContent = message; // текст уведомления
        // метод classList.toggle используется для управления классами CSS элемента в DOM
        // если isError равно true, добавляется класс error, который, стилизует уведомление как ошибку (красным цветом). 
        // если isError равно false, класс error удаляется, и уведомление стилизовано зеленым цветом
        notification.classList.toggle('error', isError); // Если isError true, добавляем класс 'error', иначе убираем
        notification.style.display = 'block'; // Отображаем уведомление, делая его видимым

        // Устанавливаем таймер на скрытие уведомления через 3 секунды
        setTimeout(() => {
            notification.style.display = 'none'; // Скрываем уведомление
        }, 3000); // Уведомление исчезнет через 3 секунды
    }
});

