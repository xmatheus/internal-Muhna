import React, { Component } from 'react';

// import { Container } from './styles';\
import './styles.css';

import { Pacman } from 'react-pure-loaders';

import EditorText from '../../../editorText';

import api from '../../../../services/api';

import swal from '@sweetalert/with-react';

import UploadFiles from '../../uploadFiles';

import { login, saveData } from '../../../../services/auth';

import AllGallery from '../../../AllGallery';

import LinkYtUpload from '../../LinkYtUpload';

import {
    Container,
    SubContainer,
    ContainerUploadFiles,
    BotaoVerde,
    Loading
} from '../../../StyledComponentsDashboard/styles';
export default class NewsCreateChanged extends Component {
	state = {
	    onScreen: false,
	    enviar: false,
	    proxPag: false,
	    title: this.props.title,
	    resume: this.props.resume,
	    news: this.props.news,
	    error: false
	};

	componentDidMount = () => {
	    setTimeout(() => {
	        this.setState({ onScreen: true });
	    }, 100);
	};

	handleChangeTitle = event => {
	    this.setState({ title: event.target.value });
	};

	handleChangeResume = event => {
	    this.setState({ resume: event.target.value });
	};

	handleChangeNews = news => {
	    this.setState({ news });
	};

	handleChangeEmail = event => {
	    this.setState({ email: event.target.value });
	};

	handleChangePasswd = event => {
	    this.setState({ password: event.target.value });
	};

	loginEnviar = () => {
	    const { email, password } = this.state;

	    api.post('/auth/authenticate', {
	        email: email,
	        password: password
	    })
	        .then(response => {
	            const { token, user } = response.data;
	            login(token);
	            saveData(user);
	            swal.stopLoading();
	            this.loginFeito();
	        })
	        .catch(() => {
	            this.erroLogin();
	            swal.stopLoading();
	        });
	};

	deuErro = () => {
	    swal({
	        title: 'Opa, problemas :|',
	        content: (
	            <div id="div-input-popup-main">
	                <div id="div-input-popup">
	                    <label>email</label>
	                    <input
	                        type="text"
	                        onChange={this.handleChangeEmail}
	                    ></input>
	                    <label>senha</label>
	                    <input
	                        type="password"
	                        onChange={this.handleChangePasswd}
	                    ></input>
	                </div>
	            </div>
	        ),
	        text: 'Sua sessão deve ter chagado ao fim, faça login novamente.',
	        icon: 'warning',
	        button: {
	            text: 'Fazer login',
	            closeModal: false
	        },
	        dangerMode: true
	    }).then(option => {
	        if (option) {
	            this.loginEnviar();
	        }
	    });
	};

	noticiaAlterada = () => {
	    swal('Sucesso', 'A notícia foi alterada!', 'success');
	};

	loginFeito = () => {
	    swal('Sucesso', 'login feito, sua sessão foi restaurada.', 'success');
	};

	erroLogin = () => {
	    swal(
	        'Error no login',
	        'sua sessão não foi restaurada. \nAlterações/envios/remoções não serão concluidas enquanto o login não for feito.',
	        'error'
	    );
	};

	enviar = () => {
	    this.setState({ enviar: true });

	    setTimeout(() => {
	        let { title, resume, news } = this.state;

	        if (
	            title === undefined ||
				title === undefined ||
				title.length === 0
	        ) {
	            title = 'Notícia do MUHNA ';
	        }

	        if (
	            resume === undefined ||
				resume === undefined ||
				resume.length === 0
	        ) {
	            resume = 'Resumo do MUHNA ';
	        }

	        if (news === undefined || news === undefined || news.length === 0) {
	            news = '<h2>Alguém se esqueceu do corpo da notícia :| </h2>';
	        }
	        api.put(`news/update?newsid=${this.props.newsid}`, {
	            title,
	            resume,
	            news
	        })
	            .then(response => {
	                const { _id, status } = response.data;
	                this.setState({ newsid: _id });
	                if (status === 401) {
	                    this.deuErro();
	                }
	                console.log('-> noticia alterada');
	                this.setState({ enviar: false });
	                this.changeEffect();
	                this.noticiaAlterada();
	                setTimeout(() => {
	                    this.setState({ proxPag: true });
	                }, 100);
	            })
	            .catch(error => {
	                this.setState({ enviar: false });
	                this.deuErro();
	            });
	    }, 200);
	};

	changeEffect = () => {
	    const formOne = document.querySelector('.sub-div-news');
	    formOne.classList.add('class-rightToLeft');
	    const formError = document.querySelector('.class-rightToLeft');
	    if (formError) {
	        formError.addEventListener('animationend', event => {
	            if (event.animationName === 'rightToLeft') {
	                formError.classList.remove('class-rightToLeft');
	            }
	        });
	    }
	};

	backPag = () => {
	    this.setState({ proxPag: false });
	};

	render() {
	    return (
			<>
				{!this.state.onScreen ? (
				    <Loading>
				        <Pacman color={'#3f2306'} loading={true} />
				    </Loading>
				) : (
				    <Container className="main-News">
				        {!this.state.proxPag ? (
				            <SubContainer className="sub-div-news">
				                <form>
				                    <label>Titulo</label>
				                    <br></br>
				                    <input
				                        value={this.state.title}
				                        type="text"
				                        name="titulo"
				                        maxLength="60"
				                        onChange={this.handleChangeTitle}
				                    />

				                    <label>Resumo</label>
				                    <br></br>
				                    <input
				                        value={this.state.resume}
				                        type="text"
				                        name="resumo"
				                        maxLength="226"
				                        onChange={this.handleChangeResume}
				                    />
				                </form>
				                <AllGallery />
				                <div className="editor-text">
				                    <EditorText
				                        onChange={this.handleChangeNews}
				                        html={this.props.news}
				                    ></EditorText>
				                </div>
				                <div className="button-div">
				                    <div id="pacmanLoad">
				                        {this.state.enviar ? (
				                            <Pacman
				                                color={'#3f2306'}
				                                loading={true}
				                            />
				                        ) : null}
				                    </div>

				                    <button
				                        onClick={() => {
				                            this.enviar();
				                        }}
				                    >
										próximo
				                    </button>
				                </div>
				            </SubContainer>
				        ) : (
							<>
								<ContainerUploadFiles className="proxPage-NewsChange">
								    <h1>Adicionar mídia a notícia</h1>
								    <UploadFiles
								        newsid={this.props.newsid}
								    ></UploadFiles>
								    <LinkYtUpload newsid={this.props.newsid} />

								    <BotaoVerde
								        id="proxPage-NewsChange"
								        onClick={() => {
								            this.props.getNews(this.props.page);
								            setTimeout(() => {
								                this.props.backpag();
								            }, 100);
								        }}
								    >
										Finalizar
								    </BotaoVerde>
								</ContainerUploadFiles>
							</>
				        )}
				        <ul className="squares"></ul>
				    </Container>
				)}
			</>
	    );
	}
}
