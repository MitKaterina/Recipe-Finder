$(document).ready(function() {
    $('.owl-carousel').owlCarousel({
        loop: true, // Бесконечный цикл
        margin: 10, // Отступы между элементами
        nav: true, // Включение навигационных кнопок
        responsive: {
            0: {
                items: 1 // Показывать 1 элемент на малых экранах
            },
            600: {
                items: 3 // Показывать 2 элемента на средних экранах
            },
            1000: {
                items: 5 // Показывать 4 элемента на больших экранах
            }
        },
        navText: ['<button type="button" class="owl-prev">‹</button>', '<button type="button" class="owl-next">›</button>']
    });

    // API данные
    const apiKey = '22dbd73170msh63be409c1aa1224p183669jsn950fc64b546b';
    // const apiKey = 'd3f4a66dc7mshcb46c2daf21d9cbp1f86c7jsn095fdd8a4128'; 
    const apiHost = 'tasty.p.rapidapi.com';
    const apiUrl = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=10';

    // Асинхронная функция для загрузки рецептов
    async function loadRecipes() {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': apiHost
                }
            });
            const data = await response.json(); // Преобразование ответа в JSON
            const recipes = data.results; // Получение списка рецептов из ответа

            recipes.forEach(recipe => {
                const item = $('<div>').addClass('item').data('recipeId', recipe.id); // Добавляем id рецепта как data-атрибут
                const img = $('<img>').attr('src', recipe.thumbnail_url).attr('alt', recipe.name); // Изображение рецепта
                const overlay = $('<div>').addClass('overlay'); // Оверлей для текста
                const name = $('<h4>').text(recipe.name); // Название рецепта

                // Добавление текстовых элементов в оверлей
                overlay.append(name);
                // Добавление изображения и оверлея в элемент
                item.append(img, overlay);
                // Добавление элемента в Owl Carousel
                $('.owl-carousel').owlCarousel('add', item).owlCarousel('update');

                // Добавление обработчика клика для открытия страницы рецепта
                item.on('click', function() {
                    const recipeId = $(this).data('recipeId'); // Получаем id рецепта
                    window.location.href = `single-post.html?id=${recipeId}`; // Перенаправление на страницу рецепта с параметром id
                });
            });
        } catch (error) {
            console.error('Ошибка загрузки рецептов:', error); // Вывод ошибки в консоль
        }
    }

    // Вызов функции загрузки рецептов
    loadRecipes();
});
