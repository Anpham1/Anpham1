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

export default function reducer(state = init, action, args) {
    actions[action] && actions[action](state, ...args);
    return state;
};