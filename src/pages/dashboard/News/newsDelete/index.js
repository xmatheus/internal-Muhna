import React, { Component } from 'react';

// import { Container } from './styles';\

import { Pacman } from 'react-pure-loaders';

import swal from '@sweetalert/with-react';

import { MdDateRange, MdPerson, MdDelete } from 'react-icons/md';

import api from '../../../services/api';

import { login, saveData } from '../../../services/auth';

import './styles.css';

import '../../stylesRetangulo/styles.css';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Container,
    SubContainer,
    ContainerUploadFiles,
    BotaoVerde,
    Loading,
    PacmanLoad
} from '../../StyledComponentsDashboard/styles';

export default class NewsDelete extends Component {
	state = {
	    onScreen: false,
	    enviar: false,
	    page: 1,
	    value: 'Digite o título da notícia'
	};

	componentDidMount = () => {
	    setTimeout(() => {
	        this.setState({ onScreen: true });
	        this.EffectCubo();
	    }, 100);

	    this.getNews(this.state.page);
	};

	removeFromState = id => {
	    this.setState({
	        docs: this.state.docs.filter(news => news._id !== id)
	    });
	};

	PopupDeelete = id => {
	    swal({
	        title: 'Exluir notícia',
	        text: 'Tem certeza de que deseja excluir essa notícia?',
	        icon: 'warning',
	        buttons: ['cancelar', 'apagar'],
	        dangerMode: true
	    }).then(willDelete => {
	        if (willDelete) {
	            this.deleteNews(id);
	        }
	    });
	};
	deleteNews = id => {
	    const { docs, page } = this.state;

	    if (docs.length === 1) {
	        this.getNews(page);
	    }

	    api.post(`/news/remove?newsid=${id}`)
	        .then(response => {
	            if (response.status !== 200) {
	                console.log(response.status);
	                this.deuErro();
	                return;
	            }

	            swal('Sucesso', 'A notícia foi excluida!', 'success');
	            this.removeFromState(id);
	        })
	        .catch(erro => {
	            this.deuErro();
	        });
	};

	getNews = async (page = 1) => {
	    try {
	        const response = await api.get(`/news/show?page=${page}&limite=5`);

	        const { docs, ...pages } = response.data;

	        this.setState({ docs, pages, page });
	    } catch (error) {
	        this.noInternet();
	    }
	};

	EffectCubo = () => {
	    /* background squares */
	    const ulSquares = document.querySelector('ul.squares');

	    for (let i = 0; i < 17; i++) {
	        const li = document.createElement('li');

	        const random = (min, max) => Math.random() * (max - min) + min;

	        const size = Math.floor(random(10, 120));
	        const position = random(1, 99);
	        const delay = random(5, 0.1);
	        const duration = random(24, 12);

	        li.style.width = `${size}px`;
	        li.style.height = `${size}px`;
	        li.style.bottom = `-${size}px`;

	        li.style.left = `${position}%`;

	        li.style.animationDelay = `${delay}s`;
	        li.style.animationDuration = `${duration}s`;
	        li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;

	        ulSquares.appendChild(li);
	    }
	};

	handleChangeEmail = event => {
	    this.setState({ email: event.target.value });
	};

	handleChangePasswd = event => {
	    this.setState({ password: event.target.value });
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

	noticiaEnviada = () => {
	    swal('Sucesso', 'A notícia foi enviada!', 'success');
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

	noInternet = () => {
	    swal({
	        content: (
	            <div>
	                <h1>:( deu erro</h1>
	                <br />
	                <br />
	                <p>você está conectado a internet?</p>
	            </div>
	        ),
	        buttons: {
	            catch: {
	                text: 'ok',
	                value: 1
	            }
	        }
	    });
	};

	noticiaEnviada = () => {
	    swal({
	        content: (
	            <div>
	                <h1>:) deu certo</h1>
	                <br />
	                <br />
	                <p>a notícia foi enviada</p>
	            </div>
	        ),
	        buttons: {
	            catch: {
	                text: 'certo'
	            }
	        }
	    });
	};

	ArrumaData = data => {
	    return data.substring(0, 10);
	};

	back = () => {
	    let { page } = this.state;

	    if (page === 1) {
	        return;
	    } else {
	        page -= 1;
	        this.setState({ docs: null });
	        this.getNews(page);
	    }
	};

	prox = () => {
	    let { pages, page } = this.state;

	    if (page === pages.pages) {
	        return;
	    } else {
	        page += 1;
	        this.setState({ docs: null });
	        this.getNews(page);
	    }
	};

	editNews = (title, resume, news, newsid) => {
	    this.setState({ title, resume, news, newsid });
	    this.setState({ proxPag: true });
	};

	backPag = () => {
	    this.setState({ proxPag: false });
	};

	changeInput = async e => {
	    const value = e.target.value;
	    this.setState({ value });

	    if (value.length > 0) {
	        this.setState({ searchActive: true });
	        const response = await api.post(`/news/search?title=${value}`);

	        const { docs } = response.data;

	        this.setState({ docs });
	    } else {
	        this.setState({ searchActive: false });
	        this.getNews(this.state.page);
	    }
	};

	render() {
	    const { pages, page } = this.state;
	    return (
			<>
				{!this.state.onScreen ? (
				    <Loading>
				        <Pacman color={'#3f2306'} loading={true} />
				    </Loading>
				) : (
				    <Container className="newsDelete-main-News">
				        <SubContainer className="newsDelete-sub-div-news">
				            <div id="inputOne">
				                <br />
				                <input
				                    value={this.state.value}
				                    type="text"
				                    onChange={this.changeInput}
				                    onBlur={() => {
				                        this.setState({
				                            value:
												'Digite o título das notícias'
				                        });

				                        setTimeout(() => {
				                            this.getNews(this.state.page);
				                            this.setState({
				                                searchActive: false
				                            });
				                        }, 100);
				                    }}
				                    onFocus={() => {
				                        this.setState({
				                            value: ''
				                        });
				                    }}
				                />
				                <br />
				                <br />
				            </div>
				            {this.state.docs ? (
								<>
									{this.state.docs.length ? (
										<>
											{!this.state.searchActive ? (
												<>
													<div className="div-title-deleteNews">
													    <h2>
															Ou veja todas as
															notícias
													    </h2>
													</div>
												</>
											) : null}

											<div className="div-li-excludeNews">
											    <div className="new-newsDelete-sub-div-news-li">
											        <ReactCSSTransitionGroup
											            transitionName="example"
											            transitionEnterTimeout={
											                400
											            }
											            transitionLeaveTimeout={
											                200
											            }
											        >
											            {this.state.docs.map(
											                news => (
											                    <li
											                        key={
											                            news._id
											                        }
											                    >
											                        <div className="div-vertical">
											                            <div>
											                                <h4>
											                                    {news.title ||
																					'"sem titulo"'}
											                                </h4>
											                                <div className="icons-horizontal">
											                                    <MdDateRange
											                                        size={
											                                            15
											                                        }
											                                        style={{
											                                            paddingRight:
																							2 +
																							'px'
											                                        }}
											                                    />
											                                    <span>
											                                        {news.createAt
											                                            ? this.ArrumaData(
											                                                news.createAt
																						  )
											                                            : null}
											                                    </span>
											                                </div>
											                            </div>
											                            <div className="icons-horizontal">
											                                <MdPerson
											                                    size={
											                                        15
											                                    }
											                                    style={{
											                                        paddingRight:
																						2 +
																						'px'
											                                    }}
											                                />
											                                <span>
											                                    {news.autor ||
																					''}
											                                </span>
											                            </div>
											                        </div>
											                        <div
											                            className="button-delete"
											                            onClick={() => {
											                                this.PopupDeelete(
											                                    news._id
											                                );
											                            }}
											                        >
											                            <MdDelete
											                                size={
											                                    21
											                                }
											                                color="#b60202"
											                            />
											                        </div>
											                    </li>
											                )
											            )}
											        </ReactCSSTransitionGroup>
											    </div>
											</div>
											{!this.state.searchActive ? (
											    <PacmanLoad>
											        <p>
											            {page +
															'/' +
															pages.pages}
											        </p>
											    </PacmanLoad>
											) : null}
											<div className="div-button-proxAndback">
											    <button
											        disabled={page === 1}
											        onClick={this.back}
											    >
													Voltar
											    </button>
											    <button
											        disabled={
											            page === pages.pages
											        }
											        onClick={this.prox}
											    >
													Próximo
											    </button>
											</div>
										</>
									) : (
										<>
											<h2>Nenhuma notícia encontrada</h2>
										</>
									)}
								</>
				            ) : (
				                <PacmanLoad>
				                    <Pacman color={'#3f2306'} loading={true} />
				                </PacmanLoad>
				            )}
				        </SubContainer>
				        <ul className="squares"></ul>
				    </Container>
				)}
			</>
	    );
	}
}
