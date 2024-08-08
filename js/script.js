// Ключ API для доступа к сервису рецептов. Он используется для аутентификации запросов к API.
const apiKey = '22dbd73170msh63be409c1aa1224p183669jsn950fc64b546b'; 
// const apiKey = 'd3f4a66dc7mshcb46c2daf21d9cbp1f86c7jsn095fdd8a4128'; 

// Хост API, который определяет сервер, на который отправляются запросы.
const apiHost = 'tasty.p.rapidapi.com'; 

// URL для получения списка рецептов. Этот URL используется для запроса списка рецептов.
const apiUrl = 'https://tasty.p.rapidapi.com/recipes/list'; 

// функция для получения списка рецептов с API и их отображения на странице.
async function fetchRecipes() {
    try {
        // Выполняем GET-запрос к API для получения списка рецептов.
        const response = await fetch(apiUrl, {
            method: 'GET', // Метод запроса (GET) для получения данных.
            headers: {
                'X-RapidAPI-Key': apiKey, // Заголовок для аутентификации с использованием ключа API.
                'X-RapidAPI-Host': apiHost // Заголовок для указания хоста API.
            }
        });

        // Проверяем, успешно ли выполнен запрос.
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`); // Если статус не OK, генерируем ошибку.
        }

        // Преобразуем ответ от API из JSON-формата в объект JavaScript.
        const data = await response.json(); 
        
        // Вызываем функцию для отображения рецептов на странице, передавая полученные данные.
        displayRecipes(data.results); 
    } catch (error) {
        // В случае ошибки выводим сообщение об ошибке в консоль.
        console.error('Ошибка при получении рецептов:', error); 
    }
}

// Функция для отображения списка рецептов на странице.
function displayRecipes(recipes) {
    // Получаем контейнер для рецептов на странице. 
    // Если контейнер для тегов существует, используем его, иначе используем контейнер для списка рецептов.
    const container = document.getElementById('tag-recipes-container') || document.getElementById('recipes-container'); 
    if (!container) {
        // Если контейнер не найден, выводим сообщение об ошибке и завершаем выполнение функции.
        console.error('Контейнер для рецептов не найден');
        return;
    }
    // Очищаем контейнер перед добавлением новых рецептов, чтобы не было дублирования данных.
    container.innerHTML = ''; 

    // Проходим по каждому рецепту в списке рецептов.
    recipes.forEach(recipe => {
        // Создаем HTML-элемент для каждого рецепта.
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe'; // Добавляем CSS-класс для стилей.

        // Создаем элемент для названия рецепта.
        const title = document.createElement('h3');
        title.textContent = recipe.name; // Устанавливаем текст в элемент, который содержит название рецепта.
        // Добавляем событие клика на заголовок рецепта, которое вызывает функцию для перехода на страницу с деталями рецепта.
        title.onclick = () => showRecipeDetails(recipe.id); 

        // Создаем контейнер для изображения и описания рецепта.
        const parentImg = document.createElement('div');
        parentImg.className = 'parentimg'; // Добавляем CSS-класс для стилей.

        // Создаем элемент изображения рецепта.
        const thumbnail = document.createElement('img');
        thumbnail.className = 'recipe-image'; // Добавляем CSS-класс для стилей.
        thumbnail.src = recipe.thumbnail_url; // Устанавливаем URL изображения рецепта.
        thumbnail.alt = recipe.name; // Устанавливаем альтернативный текст (alt) для изображения.

        // Создаем элемент для описания рецепта.
        const description = document.createElement('p');
        description.className = 'recipe-description'; // Добавляем CSS-класс для стилей.
        // Устанавливаем текст описания рецепта, если описание отсутствует, выводим стандартное сообщение.
        description.textContent = recipe.description || 'The description is not available, but you can watch the recipe video or read the comments'; 

        // Создаем контейнер для тегов рецепта.
        const tags = document.createElement('div');
        tags.className = 'tags'; // Добавляем CSS-класс для стилей.

        // Проходим по каждому тегу в рецепте и создаем кнопку для этого тега.
        recipe.tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag.display_name; // Устанавливаем текст кнопки, который соответствует названию тега.
            // Добавляем событие клика на тег, чтобы сохранить выбранный тег в localStorage и перейти на страницу фильтрации по тегу.
            tagButton.onclick = () => filterByTag(tag.name); 
            
            tags.appendChild(tagButton); // Добавляем кнопку в контейнер тегов.
        });

        // Добавляем все элементы рецепта в основной контейнер рецепта.
        recipeDiv.appendChild(title); // Добавляем заголовок.
        recipeDiv.appendChild(parentImg); // Добавляем контейнер для изображения и описания.
        parentImg.appendChild(description); // Добавляем описание в контейнер.
        parentImg.appendChild(thumbnail); // Добавляем изображение в контейнер.
        recipeDiv.appendChild(tags); // Добавляем контейнер с тегами.
        container.appendChild(recipeDiv); // Добавляем рецепт в основной контейнер на странице.
    });
}

// Функция для перехода на страницу с деталями рецепта single-post.html.
function showRecipeDetails(recipeId) {
    // Сохраняем ID рецепта в localStorage, чтобы можно было его использовать на другой странице.
    localStorage.setItem('selectedRecipeId', recipeId); 
    // Перенаправляем пользователя на страницу с деталями рецепта, добавляя ID рецепта в URL.
    window.location.href = `single-post.html?id=${recipeId}`; 
}

// Асинхронная функция для загрузки деталей рецепта на странице single-post.html.
async function loadRecipeDetails() {
    // Получаем ID рецепта из localStorage, который был сохранен ранее.
    const recipeId = localStorage.getItem('selectedRecipeId'); 
    if (!recipeId) {
        // Если ID рецепта не найден, выводим сообщение об ошибке и завершаем выполнение функции.
        console.error('ID рецепта не найдено в localStorage');
        return;
    }

    try {
        // Выполняем GET-запрос к API для получения деталей рецепта по его ID.
        const response = await fetch(`${apiUrl}?id=${recipeId}`, {
            method: 'GET', // Метод запроса (GET) для получения данных.
            headers: {
                'X-RapidAPI-Key': apiKey, // Заголовок для аутентификации с использованием ключа API.
                'X-RapidAPI-Host': apiHost // Заголовок для указания хоста API.
            }
        });

        // Проверяем, успешно ли выполнен запрос.
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`); // Если статус не OK, генерируем ошибку.
        }

        // Преобразуем ответ от API из JSON-формата в объект JavaScript.
        const data = await response.json(); 
        // Находим нужный рецепт по его ID среди полученных данных.
        const recipe = data.results.find(r => r.id === parseInt(recipeId)); 
        // Вызываем функцию для отображения деталей рецепта на странице.
        displayRecipeDetails(recipe); 
    } catch (error) {
        // В случае ошибки выводим сообщение об ошибке в консоль.
        console.error('Ошибка при получении деталей рецепта:', error);
    }
}

// Функция для отображения деталей рецепта на странице single-post.html.
function displayRecipeDetails(recipe) {
    // Устанавливаем название рецепта в соответствующий элемент на странице.
    document.getElementById('recipe-title').textContent = recipe.name; 
    // Устанавливаем описание рецепта в соответствующий элемент на странице.
    document.getElementById('recipe-description').textContent = recipe.description; 

    // Устанавливаем количество порций, если оно есть, иначе выводим "N/A".
    document.getElementById('recipe-servings').textContent = `${recipe.num_servings || 'N/A'} people`; 
    // Устанавливаем время приготовления, если оно есть, иначе выводим "N/A".
    document.getElementById('recipe-time').textContent = `${recipe.prep_time_minutes || 'N/A'} minutes`; 

    // Получаем элемент списка ингредиентов и заполняем его данными.
    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = recipe.sections[0].components.map(component => `<li>${component.raw_text}</li>`).join(''); 

    // Получаем элемент списка инструкций и заполняем его данными.
    const instructionsList = document.getElementById('recipe-instructions');
    instructionsList.innerHTML = recipe.instructions.map(instruction => `<li>${instruction.display_text}</li>`).join(''); 
}

// Функция для фильтрации рецептов по тегу и перехода на страницу tags.html.
function filterByTag(tagName) {
    // Сохраняем выбранный тег в localStorage, чтобы использовать его на другой странице.
    localStorage.setItem('selectedTag', tagName); 
    // Перенаправляем пользователя на страницу, где будут показаны рецепты с выбранным тегом.
    window.location.href = 'tags.html'; 
}

// Асинхронная функция для загрузки рецептов по тегу на странице tags.html.
async function loadRecipesByTag() {
    // Получаем выбранный тег из localStorage.
    const tagName = localStorage.getItem('selectedTag'); 

    if (!tagName) {
        // Если тег не найден, выводим сообщение об ошибке и завершаем выполнение функции.
        console.error('Тег не найден в localStorage');
        return;
    }

    try {
        // Запрашиваем рецепты, содержащие выбранный тег, у API.
        const response = await fetch(`${apiUrl}?tags=${tagName}`, {
            method: 'GET', // Метод запроса (GET) для получения данных.
            headers: {
                'X-RapidAPI-Key': apiKey, // Заголовок для аутентификации с использованием ключа API.
                'X-RapidAPI-Host': apiHost // Заголовок для указания хоста API.
            }
        });

        // Проверяем, успешно ли выполнен запрос.
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`); // Если статус не OK, генерируем ошибку.
        }

        // Преобразуем ответ от API из JSON-формата в объект JavaScript.
        const data = await response.json(); 

        if (data.results.length > 0) {
            // Находим первый рецепт, содержащий тег с названием tagName.
            const recipeWithTag = data.results.find(recipe => 
                recipe.tags.some(tag => tag.name === tagName)
            );

            if (recipeWithTag) {
                // Находим тег в рецепте и получаем его display_name.
                const tag = recipeWithTag.tags.find(tag => tag.name === tagName);
                const displayName = tag ? tag.display_name : tagName; // Если display_name найден, используем его, иначе используем tagName.

                // Обновляем breadcrumb с названием тега.
                const breadcrumbOption = document.querySelector('.breadcrumb__option span');
                if (breadcrumbOption) {
                    breadcrumbOption.textContent = `Recipes by tag: ${displayName}`;
                } else {
                    // Если элемент breadcrumb не найден, выводим сообщение об ошибке.
                    console.error('Элемент breadcrumb__option не найден');
                }
            }
        }

        // Отображаем отфильтрованные рецепты на странице.
        displayRecipes(data.results); 
    } catch (error) {
        // В случае ошибки выводим сообщение об ошибке в консоль.
        console.error(`Ошибка при фильтрации рецептов по тегу (${tagName}):`, error);
    }
}

// Определение, какая страница загружена, и вызов соответствующих функций.
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, существует ли контейнер для списка рецептов на главной странице.
    if (document.getElementById('recipes-container')) {
        fetchRecipes(); // Если контейнер найден, загружаем рецепты на главную страницу.
    } 
    // Проверяем, существует ли контейнер для деталей рецепта на странице single-post.html.
    else if (document.getElementById('recipe-details-container')) {
        loadRecipeDetails(); // Если контейнер найден, загружаем детали рецепта.
    } 
    // Проверяем, существует ли контейнер для рецептов по тегу на странице tags.html.
    else if (document.getElementById('tag-recipes-container')) {
        loadRecipesByTag(); // Если контейнер найден, загружаем рецепты по тегу.
    }
});
