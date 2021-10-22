import html from '../core.js';
import {connect} from './../store.js';
import Header from './Header.js';
import TodoList from './TodoList.js';
import Footer from './Footer.js';

function App({todos, filter, filters, editIndex}) {
    return html`
        <section class ="todoapp">
            ${Header()}
            ${TodoList(todos, filters, editIndex)}
            ${todos.length > 0 && Footer(filter, filters, todos)}
        </section>
    `;
};

export default connect()(App);
