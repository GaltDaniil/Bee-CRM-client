(() => {
    /**
     * Plugin Name: Добавление кастомного пункта меню в системное меню
     * Description: Скрипт позволяет добавить любой пункт меню по своему желанию в системное меню в разделе "Настройки аккаунта" на GetCourse
     * Version: 1.0
     * Author: Трофимов Никита Игоревич (Бородатый Геткурс)
     * Author URL: https://t.me/NiktarioN
     */

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const NEW_MENU_ITEMS_ARRAY = [['Beechat', '/saas/account/api']];

    const addNewItemMenuToMainSettingMenu = () => {
        // Указываем селектор блока главного меню на системной странице
        const MAIN_MENU_BLOCK_SELECTOR = 'gc-account-user-submenu-bar-notifications';

        // Проверяем наличие блока меню с нужным классом
        const mainMenuBlocks = document.getElementsByClassName(MAIN_MENU_BLOCK_SELECTOR);

        if (mainMenuBlocks.length > 0) {
            const mainMenuBlock = mainMenuBlocks[0];
            console.log(mainMenuBlock);
            const menuList = mainMenuBlock.querySelector('ul');

            if (menuList && !menuList.querySelector('.menu-item-custom')) {
                NEW_MENU_ITEMS_ARRAY.forEach((item) => {
                    const [title, link] = item;

                    // Создайте новый элемент списка
                    const newMenuItem = document.createElement('li');
                    newMenuItem.className = 'menu-item menu-item-custom';

                    // Создайте ссылку для нового пункта меню
                    const newMenuLink = document.createElement('a');
                    newMenuLink.href = link;
                    newMenuLink.className = 'subitem-link';
                    newMenuLink.target = '_self';
                    newMenuLink.textContent = title;

                    // Добавьте новый пункт меню в список
                    newMenuItem.appendChild(newMenuLink);
                    menuList.appendChild(newMenuItem);
                });
            }
        }
    };

    const observerCallback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addNewItemMenuToMainSettingMenu();
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(targetNode, config);

    window.addEventListener('DOMContentLoaded', addNewItemMenuToMainSettingMenu);
})();
