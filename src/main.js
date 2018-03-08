import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const WINDOW_SIZE = {
    SMALL: {
        rows: 30,
        cols: 50,
        width: '600px',
        height: '360px'
    }
}
/**
 * Function to get the initial random state
 */
const getRandomState = (rowCount, colCount) => {
    let state = [];

    for (let i = 0; i < rowCount; i++) {
        let currentRow = [];
        for (let j = 0; j < colCount; j++) {
            let isAlive = Math.random() >= 0.70;
            let currentCellState = isAlive ? 'alive' : 'dead';
            currentRow.push(currentCellState);
        }
        state.push(currentRow);
    }
    return state;
};

const isAlive = (state) => state === 'alive' || state === 'old';

const getNeighbourStates = (state, x , y) => {
    const rows = state.length;
    const cols = state[0].length;

    let prevRow = x === 0 ? (rows - 1) : (x - 1);
    let currRow = x;
    let nextRow = (x === rows - 1) ? 0 : (x + 1);

    let prevCol = y === 0 ? (cols - 1) : (y - 1);
    let currCol = y;
    let nextCol = (y === cols - 1) ? 0 : (y + 1);

    return [
        state[prevRow][prevCol], state[prevRow][currCol], state[prevRow][nextCol],
        state[currRow][prevCol],                          state[currRow][nextCol],
        state[nextRow][prevCol], state[nextRow][currCol], state[nextRow][nextCol]
    ];

};

const getNextCellState = (state, x , y) => {
    let currState = state[x][y];
    let neighbourStates = getNeighbourStates(state, x, y);
    let aliveNeighbourCount = neighbourStates.filter(isAlive).length;
    let nextState = currState;
    //Current cell is alive
    if ( isAlive(currState) ){
        
        if (aliveNeighbourCount < 2) {
            // Any live cell with fewer than two live neighbours dies, 
            // as if caused by underpopulation
            nextState = 'dead';
        } else if (aliveNeighbourCount === 2 || aliveNeighbourCount === 3){
            // Any live cell with two or three live neighbours lives on to the next generation
            nextState = 'old';
        } else if (aliveNeighbourCount > 3) {
            // Any live cell with more than three live neighbours dies, as if by overpopulation
            nextState = 'dead';
        }
    } else {
        //Any dead cell with exactly three live neighbours becomes a live cell, 
        //as if by reproduction
        if (aliveNeighbourCount === 3){
            nextState = 'alive';
        }
    }
    return nextState;
};

const getNextBoardState = (state) => {
    return state.map((row, rowIdx) => {
        return row.map((currCell, colIdx) => {
            return getNextCellState(state, rowIdx, colIdx);
        });
    });
};

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
        this.windowSize = WINDOW_SIZE.SMALL;
        this.state = {
            active: true,
            intervalId: null
        }
    }

    componentWillMount() {
        this.setState({
            board: getRandomState(this.windowSize.rows, this.windowSize.cols)
        });
        this.play();
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
        let intervalId = window.setInterval(()=>{
            this.setState({
                board: getNextBoardState(this.state.board)
            });
        },250);
            
        this.setState({
            intervalId: intervalId,
            active: true
        });
    }

    pause() {
        if (this.state.intervalId) {
            window.clearInterval(this.state.intervalId);
            this.setState({
                intervalId: null,
                active: false
            })
        }    
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
