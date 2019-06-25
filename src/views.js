const { $, _, Backbone } = require('./util');
const { Pessoa, PessoaCollection } = require('./models');

const FormView = Backbone.View.extend({
    model: new Pessoa({ nome: 'Usuário', idade: 18}),
    events: {
        "change .input": "change",
        "click button.confirm": "confirm",
    },
    update:function(){
        this.listenTo(this.model, "change", this.render);
        this.render();
    },
    initialize: function() {
        this.update();
    },
    change:function(e){
        if(e.target){
            const value = e.target.value;
            const name = e.target.name;
            this.model.set({ [name]:value });
        }
    },
    confirm: function(e){
        if(this.model.get('nome')){
            this.collection.add(this.model);
            this.model = new Pessoa({ nome: '', idade:0});
            this.update();
        }
    },
    edit:function(model){
        this.model = model;
        this.update();
    },
    template:_.template(`
    <form>
        <div>
            <label>Nome:
                <input class="input" type="text" name="nome" value="<%=nome%>" />
            </label>
            <label>Idade:
                <input class="input" type="text" name="idade" value="<%=idade%>" />
            </label>
            <button class="confirm" type="button">Ok</button>
        </div>
        <p>Nome:<%=nome%></p>
        <p>Idade:<%=idade%></p>
    </form>
    `),
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        this.delegateEvents();
    }
});

const ListView = Backbone.View.extend({
    events: {
        'click .edit':'edit',
        'click .remove':'remove'
    },
    initialize: function({formView}) {
        this.formView = formView;//Recebendo o formView para editar um registro, acoplando as coisas
        this.listenTo(this.model, "add", this.render);
        this.listenTo(this.model, "remove", this.render);
        // this.model.on("add", this.render.bind(this));
        // this.model.on("remove", this.render.bind(this));
    },
    template:_.template(`
    <ul>
        <% for(var i = 0; i < models.length; ++i) { %>
            <li>
                <%= models[i].get('nome') %>
                <button class="edit" data-id="<%=i%>">Editar</button>
                <button class="remove" data-id="<%=i%>">Remover</button>
            </li>
        <% } %>
    <ul>
    `),
    edit(e){
        const indice = $(e.target).data('id');
        const model = this.model.models[indice];
        this.model.remove(model);
        this.formView.edit(model);
    },
    remove(e){
        const indice = $(e.target).data('id');
        this.model.remove(this.model.models[indice]);
    },
    render: function() {
        this.$el.html(this.template({ models: this.model.models}));
        this.delegateEvents();
    }
});


const HomeView = Backbone.View.extend({
    el: $('#app'),
    className: "document-row",
    initialize: function() {
        this.collection = new PessoaCollection();
        this.formView = new FormView({ collection: this.collection });
        this.listView = new ListView({ model:this.collection, formView: this.formView });
        this.render();
    },
    template:_.template(`
    <h1>
        Formulário
    </h1>
    <div id="form"></div>
    <div id="list"></div>
    `),
    render: function() {
        const p = this.model;
        $(this.el).html(this.template({ p }));
        this.formView.$el = this.$('#form');
        this.formView.render();
        this.listView.$el = this.$('#list');
        this.listView.render();
        console.log(this.listView.model)
    }
});

module.exports = {
    HomeView
}