function main() {
    function html ([first, ...strings], ...values) {
        return values.reduce((acc, cur) =>
        acc.concat(cur, strings.shift()), [first])
        .filter(x => x && x !== true || x === 0)
        .join('');
    };

    const init = {
        editIndex: null,
        filter: 'all',

        filters: {
            all: () => true,
            active: todo => !todo.completed,
            completed: todo => todo.completed,
        },
        todos: [
            {
                title: 'Javascript',
                completed: false
            },
            {
                title: 'php',
                completed: true
            },
            {
                title: 'React',
                completed: false
            },
        ],
        
    };

    const actions = {
        add: function({todos}, title) {
            if(title) {
                todos.push({title, completed: false});
            }
        },
        editCancel: function(state) {
            state.editIndex = null;
        },
        editStart: function(state, index) {
            state.editIndex = index;
        },
        editEnd: function(state, title) {
            if(state.editIndex !== null) {
                if(title) {
                    state.todos[state.editIndex].title = title;
                }else{
                    this.destroy(state, state.editIndex);
                }
            }
            state.editIndex = null;
        },
        toggle: function({todos}, index) {
            const todo = todos[index];
            todo.completed = !todo.completed;
        },
        toggleAll: function({todos}, completed) {
            todos.forEach(todo => todo.completed = completed);
        },
        destroy: function({todos}, index) {
            todos.splice(index, 1);
        },
        switchFilter: function(state, filter) {
            state.filter = filter;
        },
        clearCompleted: function(state) {
           state.todos = state.todos.filter(state.filters.active);
        },
    }

    function reducer(state = init, action, args) {
        actions[action] && actions[action](state, ...args);
        return state;
    };

    function createStore (reducer) {
        let state = reducer();
        const roots = new Map();

        function render() {
            for(let [root, component] of roots) {
                const output = component();
                root.innerHTML = output;
            }
        };

        return {
            attach: function(component, root) {
              roots.set(root, component);
              render();  
            },
            connect: function(selector = state => state) {
                return component => (props, ...args) =>
                component(Object.assign({}, props, selector(state), ...args));
            },
            dispatch: function(action, ...args) {
                state = reducer(state, action, args);
                render();
            },
        };
    };

    function Footer(filter, filters, todos) {
        return html`
            <footer class="footer">
                <span class="todo-count">
                    <strong>${todos.filter(filters.active).length}</strong> item left
                </span>
                    <ul class="filters">
                        ${Object.keys(filters).map(type => html`
                        <li>
                            <a class="${filter === type && 'selected'}"
                            onclick="dispatch('switchFilter', '${type}')">
                            ${type[0].toUpperCase() + type.slice(1)}
                            </a>
                        </li>`)
                        }
                    </ul>
                    ${todos.filter(filters.completed).length > 0 && html`
                    <button class="clear-completed"
                    onclick="dispatch('clearCompleted')">Clear completed
                    </button>`}
            </footer>
        `;
    };

    function TodoItem(editIndex, todo, index) {
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
    }

    function TodoList(editIndex,filter, filters, todos) {
        return html`
            <section class ="main">
                <input id ="toggle-all" class ="toggle-all" type ="checkbox"
                onchange ="dispatch('toggleAll', this.checked)"
                ${todos.every(filters.completed) && 'checked'}>
                <label for ="toggle-all">Mark all as completed</label>
                <ul class ="todo-list">    
                    ${todos.filter(filters[filter]).map((todo, index) =>
                    TodoItem(editIndex, todo, index))}
                </ul>
            </section>
        `;
    }

    function Header() {
        return html`
            <header class = "header">
                <h1>TODOS</h1>
                <input class ="new-todo" placeholder ="What needs to be done?" autofocus
                onkeyup="event.keyCode === 13 && dispatch('add', this.value.trim()) ||
                event.keyCode === 27 && dispatch('editCancel')">
            </header>
        `;
    }

    function App({editIndex, filter, filters, todos}) {
        return html`
            <section class ="todoapp">
                ${Header()}
                ${TodoList(editIndex, filter, filters, todos)}
                ${todos.length > 0 && Footer(filter, filters, todos)}
            </section>
        `;
    };

    const {attach, connect, dispatch} = createStore(reducer);
    let component = connect()(App);
    window.dispatch = dispatch;
    attach(component, document.getElementById('root'));
   
}
main();
