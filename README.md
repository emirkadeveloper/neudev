# NeuDev — сайт-портфолио

Сайт независимой студии разработки игр **NeuDev**.

## Запуск

Открой `index.html` в браузере. Никаких сборщиков и серверов не нужно.

## Структура

```
neudev/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   └── main.js
└── assets/images/
    ├── logo/    (logo.svg, favicon.svg)
    ├── games/   (game-1.png, inside-the-screen.svg)
    └── projects/ (lunacode.png, sigmaai.png, *.svg)
```

## Контент

| Раздел | Содержимое |
|---|---|
| Hero | Описание студии, статистика |
| О студии | Соло-разработка, приглашение присоединиться |
| Игры | Inside the Screen (с itch.io ссылкой) |
| Проекты | LunaCode (активный) + SigmaAI (закрыт) |
| Технологии | Godot 4.6 |
| Контакты | Telegram @neuroffc, itch.io |

## Подробные модалки

У каждой игры/проекта есть кнопка "Подробнее" — открывает стилизованное окно с табами (Overview / Возможности / Технологии / Установка / Ссылки).

## Контакты

- Telegram: [@neuroffc](https://t.me/neuroffc)
- itch.io: [neudevstudio.itch.io](https://neudevstudio.itch.io)
- Игра: [Inside the Screen](https://neudevstudio.itch.io/inside-the-screen)
- LunaCode: [toffeesha.re/c/FRduivJAQH](https://toffeesha.re/c/FRduivJAQH)

## Как поменять контент

- **Тексты и заголовки** — `index.html`
- **Цвета темы** — `:root` в `css/style.css` (переменные `--accent`, `--accent-2`, `--accent-3`)
- **Анимация печатания в hero** — атрибут `data-words` у `.typing`
- **Цифры в статистике** — атрибуты `data-target` у `.stat-num`
