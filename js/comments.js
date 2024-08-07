
document.addEventListener('DOMContentLoaded', () => {
    // Получение ID рецепта из URL при загрузке страницы
    const urlParams = new URLSearchParams(window.location.search);
    const recipeID = urlParams.get('id');
    if (recipeID) {
        localStorage.setItem('currentRecipeID', recipeID);
    }

    // Получение текущего ID рецепта из LocalStorage
    const currentRecipeID = localStorage.getItem('currentRecipeID');
    const commentsContainer = document.querySelector('.single-post__comment');
    const commentsTitle = document.querySelector('.single-post__comment .widget__title h4');

    // Получение комментариев из LocalStorage
    const comments = JSON.parse(localStorage.getItem(`comments_${currentRecipeID}`)) || [];

    // Функция для отображения комментариев
    function displayComments() {
        // Очищаем контейнер для комментариев перед добавлением новых
        const commentItemsContainer = commentsContainer.querySelector('.single-post__comment__item');
        commentItemsContainer.innerHTML = '';

        // Проходим по всем комментариям и добавляем их в контейнер
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'single-post__comment__item';

            // Создаем HTML структуру для каждого комментария
            commentItem.innerHTML = `
                <div class="single-post__comment__item__pic">
                    <img src="img/categories/single-post/comment/comment-1.jpg" alt="comment">
                </div>
                <div class="single-post__comment__item__text">
                    <h5>${comment.name}</h5>
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                    <p>${comment.message}</p>
                    <ul>
                        <li><a href="#"><i class="fa fa-heart-o"></i> ${comment.likes > 1 ? comment.likes : ''}</a></li>
                    </ul>
                </div>
            `;

            // Добавляем событие клика на иконку "сердце" для увеличения количества лайков
            const heartIcon = commentItem.querySelector('.fa-heart-o');
            if (comment.likes > 0) {
                heartIcon.classList.add('liked');
            }

            heartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                comment.likes += 1;
                localStorage.setItem(`comments_${currentRecipeID}`, JSON.stringify(comments));
                displayComments(); // Обновляем комментарии
            });

            commentItemsContainer.appendChild(commentItem);
        });

        // Обновляем количество комментариев
        const commentsCount = comments.length;
        commentsTitle.textContent = `${commentsCount} Comment${commentsCount !== 1 ? 's' : ''}`;
    }

    // Отображаем комментарии при загрузке страницы
    displayComments();

    // Обработка отправки комментариев
    const commentForm = document.querySelector('.single-post__leave__comment form');
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

        // Получаем значения из полей формы
        const name = commentForm.querySelector('input[placeholder="Name"]').value;
        const email = commentForm.querySelector('input[placeholder="Email"]').value;
        const message = commentForm.querySelector('textarea[placeholder="Message"]').value;

        // Проверяем, что все поля заполнены
        if (name && email && message) {
            const newComment = {
                name,
                email,
                message,
                date: new Date(),
                likes: 0
            };

            // Добавляем новый комментарий в массив и сохраняем в LocalStorage
            comments.push(newComment);
            localStorage.setItem(`comments_${currentRecipeID}`, JSON.stringify(comments));
            displayComments(); // Обновляем комментарии

            // Очищаем форму после отправки
            commentForm.reset();
        }
    });
});

