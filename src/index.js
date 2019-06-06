import React from 'react';
import ReactDOM, {render} from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.css';
import configureStore from './store/configureStore';

ReactDOM.render(
	<Provider store={configureStore({})}>
		<App />
	</Provider>,
	document.getElementById('root')
);
