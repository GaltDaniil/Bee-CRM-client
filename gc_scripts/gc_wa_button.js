(() => {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const addNewItemMenuToMainSettingMenu = () => {
        // Селекторы нужных элементов
        const USER_CALL_TO_PHONE_CLASS = 'user-call-to-phone';
        const USER_EMAIL_CLASS = 'user-email';

        // Получаем элемент с номером телефона
        const userPhoneElement = document.querySelector(`.${USER_CALL_TO_PHONE_CLASS}`);
        // Получаем элемент с email
        const userEmailElement = document.querySelector(`.${USER_EMAIL_CLASS}`);

        // Проверяем наличие обоих элементов
        if (userPhoneElement && userEmailElement) {
            // Извлекаем и сохраняем номер телефона
            const phoneNumber = userPhoneElement.textContent.trim();
            console.log('Номер телефона:', phoneNumber);

            // Извлекаем и сохраняем email
            const email = userEmailElement.textContent.trim();
            console.log('Email:', email);

            // Проверяем, чтобы кнопка не была добавлена несколько раз
            if (!userPhoneElement.parentElement.querySelector('.custom-round-button')) {
                // Создаем новую кнопку
                const newButton = document.createElement('button');
                newButton.className = 'custom-round-button'; // Класс для стилизации
                newButton.textContent = 'Click'; // Текст на кнопке

                // Стилизация кнопки
                Object.assign(newButton.style, {
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                });

                // Добавляем обработчик события клика на кнопку
                newButton.addEventListener('click', () => {
                    // Действие при клике на кнопку
                    alert(`Телефон: ${phoneNumber}\nEmail: ${email}`);
                });

                // Вставляем кнопку перед номером телефона
                userPhoneElement.insertAdjacentElement('beforebegin', newButton);

                console.log('Кнопка добавлена:', newButton);
            }
        } else {
            console.warn('Не удалось найти элементы с классами user-call-to-phone или user-email.');
        }
    };

    const observerCallback = (mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addNewItemMenuToMainSettingMenu();
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(targetNode, config);

    document.addEventListener('DOMContentLoaded', addNewItemMenuToMainSettingMenu);
})();
