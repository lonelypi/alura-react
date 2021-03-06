import React, { Component, Fragment } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Home.css';

import ApiService from '../../Utils/ApiService';

import Header from '../../Components/Header/Header';
import PopUp from '../../Utils/PopUp';
import Tabela from '../../Components/Tabela/Tabela';
import Form from '../../Components/Formulario/Formulario';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      autores: [],
    };
  }


  removeAutor = id => {

    const { autores } = this.state;

    const autoresAtualizado = autores.filter(autor => autor.id !== id);

    ApiService.RemoveAutor(id).then(res => ApiService.TrataErros(res)).then(res => {
      if (res.message === 'deleted') {
        this.setState({ autores: [...autoresAtualizado] });
        PopUp.exibeMensagem("error", "Autor removido com sucesso!");
      }
    }).catch(err => PopUp.exibeMensagem("error", "Erro na comunicação com a API ao tentar remover o autor."));




  };

  escutadorDeSubmit = dados => {
    
    const autor = {
      nome: dados.nome,
      livro: dados.livro,
      preco: dados.preco
    };
    
    ApiService.CriaAutor(JSON.stringify(autor))
      .then(res => {
        if (res.message === 'success') {
          this.setState({ autores: [...this.state.autores, res.data] });
          PopUp.exibeMensagem("success", "Autor adicionado com sucesso!");
        }
      }).catch(err => PopUp.exibeMensagem("error", "Erro na comunicação com a API ao tentar adicionar o autor."));


  }

  componentDidMount() {

    ApiService.ListaAutores()
      .then(res => {
        if (res.message === 'success') {
          this.setState({ autores: [...this.state.autores, ...res.data] })
        }
      }).catch(err => PopUp.exibeMensagem("error", "Erro na comunicação com a API ao tentar listar os autores."));
  }

  render() {
    const campos = [{titulo: 'Autores', dado: 'nome'},
                    {titulo: 'Livros', dado: 'livro'}, 
                    {titulo: 'Preços', dado: 'preco'},
                     'Remover']
    return (
      <Fragment>
        <Header />

        <div className="container mb-10">
          <h3>Casa do Código</h3>
          <Form escutadorDeSubmit={this.escutadorDeSubmit} />
          <Tabela campos={campos} dados={this.state.autores} removeDados={this.removeAutor} />
        </div>

      </Fragment>
    );
  }

}

export default App;
