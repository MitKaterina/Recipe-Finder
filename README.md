# Recipe Finder Web Application

## Описание

Это веб-приложение для поиска рецептов, использующее API от Tasty для получения данных о рецептах. Приложение предоставляет несколько функциональных возможностей, включая:

- **Главная страница: index.html**  Слайдер с фото и названием рецептов.
- **Страница со списком рецептов: categories-list.html** Отображает название рецепта, описание, фото и теги. Вы можете фильтровать рецепты по тегам.
- **Страница рецепта: single-post.html** При клике на любой рецепт вы перейдете на страницу с подробной информацией о рецепте, включая название, время приготовления, количество персон, ингредиенты и инструкции.
- **Комментарии:** Вы можете оставлять комментарии под рецептами. Каждый комментарий отображается только под тем рецептом, где был оставлен. Также доступен счетчик комментариев и возможность лайкать комментарии. Лайки отображаются начиная с 2.
- **Контактная страница: contact.html** Возможность отправить сообщение на указанный адрес электронной почты.
---
## Инструменты и технологии

- **API для рецептов:** [Tasty API](https://rapidapi.com/apidojo/api/tasty)
- **Email отправка:** [EmailJS](https://www.emailjs.com/)
---
## Установка и настройка

### 1. Клонирование репозитория

Клонируйте этот репозиторий на ваш локальный компьютер:

```bash
git clone https://github.com/ваш-пользователь/ваш-репозиторий.git
cd ваш-репозиторий
```

### 2. Настройка API и EmailJS

* Tasty API:

Получите ваш X-RapidAPI-Key на RapidAPI.
Замените apiKey в вашем коде на ваш реальный ключ AX-RapidAPI-Key PI.


* EmailJS:

Зарегистрируйтесь на EmailJS и получите ваш Public Key, Service ID и Template ID.
Замените YOUR_USER_ID, YOUR_SERVICE_ID, и YOUR_TEMPLATE_ID в файле contacts.js на ваши реальные значения.


### 3. Настройка contacts.js

В файле contacts.js замените следующие значения:

'YOUR_USER_ID' на ваш Public Key из EmailJS.
'YOUR_SERVICE_ID' на ваш Service ID из EmailJS.
'YOUR_TEMPLATE_ID' на ваш Template ID из EmailJS.

---
### Пояснения:

- **Инструкция по клонированию:** Указывает, как клонировать репозиторий и перейти в директорию проекта.
- **Настройка API и EmailJS:** Описывает, как получить ключи для Tasty API и EmailJS, а также как заменить их в коде.
- **Как использовать:** Пошаговая инструкция по работе с приложением.


>Если у вас есть предложения по улучшению приложения или вы нашли ошибку, пожалуйста, создайте issue или отправьте pull request.
