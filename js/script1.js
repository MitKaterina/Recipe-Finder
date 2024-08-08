const apiKey = '22dbd73170msh63be409c1aa1224p183669jsn950fc64b546b'; // Ключ API для доступа к сервису рецептов замените на ваш
const apiHost = 'tasty.p.rapidapi.com'; // Хост API для запросов
const apiUrl = 'https://tasty.p.rapidapi.com/recipes/list'; // Базовый URL для получения списка рецептов

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

        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }

        const data = await response.json(); // Преобразование ответа в формат JSON
        displayRecipes(data.results); // Отображение рецептов на странице
    } catch (error) {
        console.error('Ошибка при получении рецептов:', error); // Вывод ошибки в консоль
    }
}

// Функция для отображения рецептов на странице
function displayRecipes(recipes) {
    const container = document.getElementById('tag-recipes-container') || document.getElementById('recipes-container');
    if (!container) {
        console.error('Контейнер для рецептов не найден');
        return;
    }
    container.innerHTML = ''; // Очищаем контейнер перед добавлением новых рецептов

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';

        const title = document.createElement('h3');
        title.textContent = recipe.name; // Название рецепта
        title.onclick = () => showRecipeDetails(recipe.id); // При клике на заголовок открывается страница с деталями рецепта

        const parentImg = document.createElement('div');
        parentImg.className = 'parentimg';

        const thumbnail = document.createElement('img');
        thumbnail.className = 'recipe-image';
        thumbnail.src = recipe.thumbnail_url; // URL изображения рецепта
        thumbnail.alt = recipe.name;

        const description = document.createElement('p');
        description.className = 'recipe-description';
        description.textContent = recipe.description || 'The description is not available, but you can watch the recipe video or read the comments'; // Описание рецепта

        const tags = document.createElement('div');
        tags.className = 'tags';
        recipe.tags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag.display_name; // Отображаем название тега (display_name)
            // tagButton.onclick = () => filterByTag(tag.name); // При клике на тег сохраняем тег (name) в localStorage
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
    localStorage.setItem('selectedRecipeId', recipeId); // Сохраняем ID рецепта в localStorage
    window.location.href = `single-post.html?id=${recipeId}`; // Переход на страницу с деталями рецепта
}

// Функция для загрузки деталей рецепта на странице single-post.html
async function loadRecipeDetails() {
    const recipeId = localStorage.getItem('selectedRecipeId'); // Получаем ID рецепта из localStorage
    if (!recipeId) {
        console.error('ID рецепта не найдено в localStorage');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?id=${recipeId}`, {
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
        const recipe = data.results.find(r => r.id === parseInt(recipeId)); // Находим рецепт по ID
        displayRecipeDetails(recipe); // Отображаем детали рецепта
    } catch (error) {
        console.error('Ошибка при получении деталей рецепта:', error);
    }
}

// Функция для отображения деталей рецепта на странице single-post.html
function displayRecipeDetails(recipe) {
    document.getElementById('recipe-title').textContent = recipe.name; // Название рецепта
    document.getElementById('recipe-description').textContent = recipe.description; // Описание рецепта
    // document.getElementById('recipe-image').textContent = recipe.thumbnail_url; // фото рецепта
    // document.getElementById('recipe-video').textContent = recipe.original_video_url; // видео рецепта
    document.getElementById('recipe-servings').textContent = `${recipe.num_servings || 'N/A'} people`; // Количество порций
    document.getElementById('recipe-time').textContent = `${recipe.prep_time_minutes || 'N/A'} minutes`; // Время приготовления

    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.innerHTML = recipe.sections[0].components.map(component => `<li>${component.raw_text}</li>`).join(''); // Ингредиенты

    const instructionsList = document.getElementById('recipe-instructions');
    instructionsList.innerHTML = recipe.instructions.map(instruction => `<li>${instruction.display_text}</li>`).join(''); // Инструкции

}

// Функция для фильтрации рецептов по тегу и отображения на странице tags.html
function filterByTag(tagName) {
    localStorage.setItem('selectedTag', tagName); // Сохраняем выбранный тег в localStorage
    window.location.href = 'tags.html'; // Переход на страницу с рецептами по тегу
}

async function loadRecipesByTag() {
    const tagName = localStorage.getItem('selectedTag'); // Получаем выбранный тег из localStorage

    if (!tagName) {
        console.error('Тег не найден в localStorage');
        return;
    }

    try {
        // Запрашиваем рецепты, содержащие выбранный тег
        const response = await fetch(`${apiUrl}?tags=${tagName}`, {
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

        // Обновляем breadcrumb с названием тега
        const breadcrumbOption = document.querySelector('.breadcrumb__option span');
        if (breadcrumbOption) {
            breadcrumbOption.textContent = `Recipes by tags ${tagName}`;
        } else {
            console.error('Элемент breadcrumb__option не найден');
        }
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
