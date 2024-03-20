document.addEventListener('DOMContentLoaded', function () {
    const mainBtn = document.getElementById('bee-main-button');
    const closeWidgetsBtn = document.getElementById('bee-close-widgets-button');
    const buttonsIframes = document.getElementById('buttons-iframe');
    const liveChatDiv = document.getElementById('bee-livechat');
    const iframeDiv = document.getElementById('livechat-iframe');

    mainBtn.addEventListener('click', () => {
        mainBtn.classList.add('bee_hidden');
        closeWidgetsBtn.classList.remove('bee_hidden');
        buttonsIframes.style.height = '202px';
        buttonsIframes.contentWindow.postMessage(
            { action: 'showButtons', location: window.location.href },
            '*',
        );
    });

    closeWidgetsBtn.addEventListener('click', () => {
        let hasHiddenClass = liveChatDiv.classList.contains('bee_hidden');
        if (hasHiddenClass) {
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
            buttonsIframes.style.height = '0px';
        } else {
            liveChatDiv.classList.add('bee_hidden');
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
        }
    });

    window.addEventListener('message', function (event) {
        //if (event.origin !== 'https://beechat.ru') return; // Убедитесь, что это сообщение от вашего iframe

        var message = event.data;
        if (message.action === 'showLiveChat') {
            buttonsIframes.style.height = '0px';
            liveChatDiv.classList.remove('bee_hidden');
            console.log('отработало до');
            iframeDiv.contentWindow.postMessage(
                { action: 'showLiveChat', location: window.location.href },
                '*',
            );
            console.log('и после');
        }
        if (message.action === 'hideLiveChat') {
            liveChatDiv.classList.add('bee_hidden');
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
        }
    });
});
