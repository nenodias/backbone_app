const { $, _, Backbone } = require('./util');
const { HomeView } = require('./views');

const app = new HomeView();
Window.app = app;