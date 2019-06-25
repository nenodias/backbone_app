const { $, _, Backbone } = require('./util');
const Pessoa = Backbone.Model.extend({
    setNome: function(nome) {
        this.set({nome});
    },
    getNome: function(){
        return this.get('nome');
    },
    setIdade: function(idade) {
        this.set({idade});
    },
    getIdade: function(){
        return this.get('idade');
    }
});

var PessoaCollection = Backbone.Collection.extend({

    model: function(attrs, options) {
        return new Pessoa(attrs, options);
    }
  
});

module.exports = {
    Pessoa,
    PessoaCollection
}