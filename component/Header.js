import html from "../core.js";

export default function Header() {
    return html`
        <header class = "header">
            <h1>TODOS</h1>
            <input class ="new-todo" placeholder ="What needs to be done?" autofocus
            onkeyup="event.keyCode === 13 && dispatch('add', this.value.trim()) ||
            event.keyCode === 27 && dispatch('editCancel')">
        </header>
    `;
};