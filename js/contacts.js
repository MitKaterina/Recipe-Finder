document.addEventListener('DOMContentLoaded', () => {
    // Инициализация EmailJS с вашим User ID
    emailjs.init('Smn1LwGJq3ohrBHdq'); // Замените 'User ID' на ваш реальный User ID из EmailJS

    // Находим форму по классу
    const form = document.querySelector('.contact__form form');

    // Находим элемент для уведомлений по ID
    const notification = document.getElementById('notification');

    // Добавляем обработчик события на отправку формы
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // Получаем значения из полей формы по ID
        const name = document.getElementById('name').value; // Имя отправителя
        const email = document.getElementById('email').value; // Электронная почта отправителя
        const message = document.getElementById('message').value; // Сообщение отправителя

        // Проверяем, что все поля заполнены
        if (!name || !email || !message) {
            showNotification('Please fill in all fields of the form.', true); // Показываем пользователю сообщение о незаполненных полях
            return; 
        }

        // Проверяем, что поле email содержит символ '@'
        if (!email.includes('@')) {
            showNotification('Please enter a valid email address.', true); // Показываем пользователю сообщение о некорректном email
            return; 
        }

        // Подготовка параметров для отправки
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        // Отправка письма с помощью EmailJS
        emailjs.send('service_ynqynre', 'template_jhk6ttj', templateParams) // Замените 'service ID' 'template ID' на ваш из EmailJS
            .then((response) => { // Если отправка прошла успешно
                console.log('SUCCESS!', response.status, response.text); // Логируем успешный ответ
                showNotification('Congratulations! Your message has been sent successfully!', false); // Показываем пользователю сообщение об успешной отправке
                form.reset(); 
            }, (error) => { // Если произошла ошибка
                console.log('FAILED...', error); // Логируем ошибку
                showNotification('Unfortunately, the message could not be sent. Try again.', true); // Показываем пользователю сообщение об ошибке
            });
    });

    // Функция для показа уведомления
    function showNotification(message, isError) {
        notification.textContent = message; // Устанавливаем текст уведомления
        notification.classList.toggle('error', isError); // Устанавливаем класс ошибки, если isError равно true
        notification.style.display = 'block'; // Отображаем уведомление

        // Устанавливаем таймер на скрытие уведомления через 3 секунды
        setTimeout(() => {
            notification.style.display = 'none'; // Скрываем уведомление
        }, 5000); // Уведомление исчезнет через 3 секунды
    }
});
