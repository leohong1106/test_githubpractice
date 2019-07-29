import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Carlistr.scss';

class CarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carlist: []
        }
    }
    componentDidMount() {
        axios({
            url: 'http://70.12.50.162:3000/api/carlist',
            // url: 'http://localhost:5002/api/carlist',
            //url: '/api/carlist',
            method: 'get'
        })
            .then(response => {
                console.log('success: ', response);
                let newList = response.data.map(c => {
                    return (
                        <tr key={c.carNumber}>
                            <td>{c.carNumber}</td>
                            <td>{c.owner}</td>
                            <td>{c.model}</td>
                            <td>{c.company}</td>
                            <td>{c.numOfAccident}</td>
                            <td>{c.numOfOwnerChange}</td>
                        </tr>
                    );
                })
                this.setState({
                    carlist: newList
                })
            })

            .catch(error => {
                console.log('error :', error);
                this.setState({
                    carlist: []
                })
            });
    }
    render() {
        return (
            <div className="car2">
                <h1>차량 정보</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>차량번호</th>
                            <th>소유자</th>
                            <th>모델</th>
                            <th>회사</th>
                            <th>사고횟수</th>
                            <th>소유자 변경횟수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.carlist}
                    </tbody>
                </Table>
            </div>
        );
    }
}
export default CarList;