import React, { Component } from 'react';
import ReactDOM from 'react-dom';

let COLS = 50;
let ROWS = 30;

/**
 * Function to get the initial random state
 */
const getRandomState = () => {
    let state = [];

    for (let i = 0; i < ROWS; i++) {
        let currentRow = [];
        for (let j = 0; j < COLS; j++) {
            let isAlive = Math.random() >= 0.8;
            let currentCellState = isAlive ? 'alive' : 'dead';
            currentRow.push(currentCellState);
        }
        state.push(currentRow);
    }
    return state;
}

class Cell extends Component {
    render() {
        const classes = 'cell '+this.props.status;
        return (
            <div 
                className={classes} 
                row={this.props.row} 
                col={this.props.col} 
                onClick={this.props.onCellClick}
            >
            </div>
        );
    }

}
class GameOfLifeBoard extends Component {

    constructor() {
        super();
        this.state = {
            board: getRandomState(),
            active: true
        }
       // this.play();
    }


    onCellClick(e) {
        var row = e.target.getAttribute('row');
        var col = e.target.getAttribute('col');

        var currentCellState = this.state.board[row][col];
        var nextCellState;
        switch(currentCellState) {
            case 'alive':
                nextCellState = 'dead';
                break;
            case 'dead':
                nextCellState = 'alive';
                break;
            default:
                nextCellState = currentCellState;
        }
        //Update the state
        this.state.board[row][col] = nextCellState;
        this.setState({
            board: this.state.board
        });
    }

    play() {
        window.setInterval(()=>{
            this.setState({
                board: getRandomState()
            })
        },300)
    }

    render() {
        return (
            <div id="board-container">
            {
                this.state.board.map((row, rowIndex) => {
                    return row.map((cellStatus, colIndex) => {
                        const classes = 'cell '+cellStatus;
                        return (
                            <Cell
                                key={rowIndex+'|'+colIndex} 
                                row={rowIndex} 
                                col={colIndex} 
                                status={cellStatus}
                                onCellClick={ e => this.onCellClick(e)}
                            >
                            </Cell>
                        )
                    });
                })
            }
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <div id="main-container">
            <div id="title-container">
                <header>Game of Life App</header>
            </div>
            <GameOfLifeBoard/>
        </div>    
        ,
        document.getElementById('root')
    )
};

render();
