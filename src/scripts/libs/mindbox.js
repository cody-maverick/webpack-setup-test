mindbox = window.mindbox || function() { mindbox.queue.push(arguments); };
mindbox.queue = mindbox.queue || [];

mindbox('create', {
    firebaseMessagingSenderId: "482372457752"
});

mindbox("webpush.create");

mindbox(
    "webpush.subscribe",
    {
        /**
         * V3-операция получения списка подписок.
         */
        getSubscriptionOperation: "GetWebPushSubscription",

        /**
         * V3-операция подписки клиента.
         */
        subscribeOperation: "SubscribeToWebpush",

        /**
         * Функция, которая выполнится, если клиент дал явное согласие на получение пушей
         * в этом браузере.
         * Клиент подписан на вебпуш-рассылки и сохранен в Mindbox.
         */
        onGranted: function() {},

        /**
         * Функция, которая выполнится, если клиент не дал согласие на получение пушей
         * в этом браузере.
         * Клиент не подписан на вебпуш-рассылки и не сохранен в Mindbox.
         */
        onDenied: function() {},

        /**
         * Функция, которая выполнится, если потребитель ранее явно отписался
         * от канала веб-пушей.
         *
         * Необязательный параметр.
         */
        ifUnsubscribed: function() {}
    }
);
