import React from 'react';
export const WidgetButtons = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    const [fromUrl, setFromUrl] = React.useState('');

    React.useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<any>) => {
            console.log('Событие отработало');
            if (event.data.action === 'showButtons') {
                const location = event.data.location as string;
                console.log(location);
                const modifiedString = location
                    .replace(/https?:\/\//, '')
                    .replace(/\//g, '100')
                    .replace(/-/g, '101')
                    .replace(/\./g, '102');
                console.log(modifiedString);
                setFromUrl((prev) => modifiedString);
            }
        });
        document.body.style.background = 'transparent ';
        document.body.style.backgroundColor = 'transparent ';
        document.documentElement.style.backgroundColor = 'transparent ';
        document.documentElement.style.background = 'transparent ';
        document.documentElement.style.cssText = 'background: transparent  !important;';
        document.documentElement.style.cssText = 'background-color: transparent  !important;';

        /* return () => {
            document.body.style.background = '';
        }; */
    }, []);

    var messageToParent = {
        action: 'showLiveChat',
    };

    // Отправляем сообщение родительскому документу
    const sendMessageFromIframe = () => {
        window.parent.postMessage(messageToParent, '*');
    };

    return (
        <div className="absolute bottom-0 right-0">
            <div className="mb-8">
                <a
                    target="_blank"
                    href={`https://vk.me/public212085097?ref=fromUrl=${fromUrl}`}
                    rel="noreferrer"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/256/145/145813.png"
                        alt="tg"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <div className="mb-8">
                <a
                    target="_blank"
                    href={`https://t.me/LF_support_bot?start=fromUrl=${fromUrl}`}
                    rel="noreferrer"
                >
                    <img
                        src="https://cdn.iconscout.com/icon/free/png-256/free-telegram-3691230-3073750.png"
                        alt="tg"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            {/* <div
                onClick={() => {
                    sendMessageFromIframe();
                }}
                className="flex items-center justify-center w-50 h-50 bg-orange rounded-full mt-5"
            >
                <img
                    src="https://icon-library.com/images/white-chat-icon/white-chat-icon-27.jpg"
                    alt="livechat"
                    width={27}
                    height={27}
                />
            </div> */}
        </div>
    );
};
