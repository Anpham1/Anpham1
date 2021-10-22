export default function html ([first, ...strings], ...values) {
    return values.reduce((acc, cur) =>
    acc.concat(cur, strings.shift()), [first])
    .filter(x => x && x !== true || x === 0)
    .join('');
};

export function createStore (reducer) {
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