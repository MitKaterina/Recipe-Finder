const apiKey = '96a6dde0damsh1a365b80b1738dcp18aa2djsn97571ecb5c82';
const apiHost = 'tasty.p.rapidapi.com';
const apiUrl = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=10';

// Функция для получения списка рецептов и их отображения
async function fetchRecipes() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        // Проверка успешности запроса
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }

        const data = await response.json();
        displayRecipes(data.results); // Отображение рецептов на странице
    } catch (error) {
        console.error('Ошибка при получении рецептов:', error);
    }
}

// Функция для отображения рецептов на странице рецептов categories-list.html
function displayRecipes(recipes) {
    const container = document.getElementById('tag-recipes-container') || document.getElementById('recipes-container');
    if (!container) {
        console.error('Контейнер для рецептов не найден');
        return;
    }
    container.innerHTML = ''; // Очищаем контейнер

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const title = document.createElement('h3');
        title.textContent = recipe.name;
        title.onclick = () => showRecipeDetails(recipe.id);

        const parentImg = document.createElement('div');
        parentImg.className = 'parentimg';

        const thumbnail = document.createElement('img');
        thumbnail.className = 'recipe-image';
        thumbnail.src = recipe.thumbnail_url;
        thumbnail.alt = recipe.name;

        const description = document.createElement('p');
        description.className = 'recipe-description';
        description.textContent = recipe.description || 'The description is not available, but you can watch the recipe video or read the comments';

        const tags = document.createElement('div');
        tags.className = 'tags';
        recipe.tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag.display_name;
            tagButton.onclick = () => filterByTag(tag.display_name);
            tags.appendChild(tagButton);
        });

        recipeDiv.appendChild(title);
        recipeDiv.appendChild(parentImg);
        parentImg.appendChild(description);
        parentImg.appendChild(thumbnail);
        recipeDiv.appendChild(tags);
        container.appendChild(recipeDiv);
    });
}

// Функция для перехода на страницу с деталями рецепта
function showRecipeDetails(recipeId) {
    localStorage.setItem('selectedRecipeId', recipeId); // Сохраняем ID рецепта
    window.location.href = 'single-post.html'; // Переход на страницу с деталями
}

// Функция для загрузки деталей рецепта на странице single-post.html
async function loadRecipeDetails() {
    const recipeId = localStorage.getItem('selectedRecipeId');
    if (!recipeId) {
        console.error('ID рецепта не найдено в localStorage');
        return;
    }

    try {
        const response = await fetch(`https://tasty.p.rapidapi.com/recipes/get-more-info?id=${recipeId}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }

        const recipe = await response.json();
        displayRecipeDetails(recipe); // Отображаем детали рецепта
    } catch (error) {
        console.error('Ошибка при получении деталей рецепта:', error);
    }
}

// Функция для отображения деталей рецепта на странице single-post.html
function displayRecipeDetails(recipe) {
    document.getElementById('recipe-title').textContent = recipe.name; // Название рецепта
    document.getElementById('recipe-description').textContent = recipe.description; // Описание рецепта
    document.getElementById('recipe-servings').textContent = `${recipe.num_servings || 'N/A'} people`; // Количество порций
    document.getElementById('recipe-time').textContent = `${recipe.prep_time_minutes || 'N/A'} minutes`; // Время приготовления

    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = recipe.sections[0].components.map(component => `<li>${component.raw_text}</li>`).join(''); // Ингредиенты

    const instructionsList = document.getElementById('recipe-instructions');
    instructionsList.innerHTML = recipe.instructions.map(instruction => `<li>${instruction.display_text}</li>`).join(''); // Инструкции

    const video = document.getElementById('recipe-video');
    video.src = recipe.original_video_url; // Видео рецепта
}

// Функция для фильтрации рецептов по тегу и отображения на странице tags.html
function filterByTag(tagName) {
    localStorage.setItem('selectedTag', tagName); // Сохраняем выбранный тег в localStorage
    window.location.href = 'tags.html'; // Переход на страницу с рецептами по тегу
}

// Функция для загрузки рецептов по тегу на странице tags.html
async function loadRecipesByTag() {
    const tagName = localStorage.getItem('selectedTag'); // Получаем выбранный тег из localStorage
    if (!tagName) {
        console.error('Тег не найден в localStorage');
        return;
    }

    try {
        // Запрашиваем рецепты, содержащие выбранный тег
        const response = await fetch(`${apiUrl}&tags=${tagName}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }

        const data = await response.json(); // Преобразование ответа в формат JSON
        displayRecipes(data.results); // Отображаем отфильтрованные рецепты
    } catch (error) {
        console.error(`Ошибка при фильтрации рецептов по тегу (${tagName}):`, error);
    }
}

// Определение, какая страница загружена, и вызов соответствующих функций
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recipes-container')) {
        fetchRecipes(); // Загружаем рецепты на главную страницу
    } else if (document.getElementById('recipe-details-container')) {
        loadRecipeDetails(); // Загружаем детали рецепта
    } else if (document.getElementById('tag-recipes-container')) {
        loadRecipesByTag(); // Загружаем рецепты по тегу
    }
});
