import React, { Component } from 'react';
import {Route, NavLink, HashRouter} from 'react-router-dom';
import './Mainr.scss';
import Home from './Home';
// import Stuff from './Stuff';
import Carregister from './Carregister';
import Carlistr from './Carlistr';


class Main extends Component {
    render() {
        return (
            <HashRouter>
            <div className="main">
                <h1>리액트를 통한 프로젝트 구현</h1>
                <ul className="header">
                    <li><NavLink exact to="/">Home</NavLink></li>
                    {/* <li><NavLink to="/stuff">Stuff</NavLink></li> */}
                    <li><NavLink to="/carregister">Carregister</NavLink></li>
                    <li><NavLink to="/carlist">CarList</NavLink></li>
                </ul>
                <div className="content">
                    <Route exact path="/" component={Home} />
                    {/* <Route path="/stuff" component={Stuff} /> */}
                    <Route path="/carregister" component={Carregister} />
                    <Route path="/carlist" component={Carlistr} />
                </div>
            </div>
            </HashRouter>
        );
    }
}

export default Main;