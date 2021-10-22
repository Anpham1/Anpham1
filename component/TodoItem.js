import html from "../core.js";

export default function TodoItem(editIndex, todo, index) {
    return html`
        <li class ="${todo.completed && 'completed'}
        ${editIndex === index && 'editing'}">
            <div class="view">
                <input class ="toggle" type ="checkbox" ${todo.completed && 'checked'}
                onchange ="dispatch('toggle', ${index})">
                <label ondblclick="dispatch('editStart', ${index})"
                >${todo.title}</label>
                <button class ="destroy"
                onclick="dispatch('destroy', ${index})"></button>
            </div>
            <input class ="edit" value ="${todo.title}"
            onkeyup="event.keyCode === 13 && dispatch('editEnd', this.value.trim()) ||
            event.keyCode === 27 && dispatch('editCancel')"
            onblur="dispatch('editEnd', this.value.trim())">
        </li>
    `;
};