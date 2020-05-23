import { Component, Host, Prop, State, h } from '@stencil/core';
import { chip, boardPosition, boardCoordinate } from '../../helpers/model';
import moize from 'moize';


@Component({
  tag: 'mt-connect',
  styleUrl: 'mt-connect.css'
})
export class MtConnect {

  private maxX = 6;
  private maxY = 5;

  @State() turn: chip = chip.red;
  @State() board: boardPosition[][];
  @State() winner: boardPosition = null;
  @State() lastDropped: boardCoordinate | null = null;
  @State() winningVector: boardCoordinate[] = [];

  @Prop() connect: number = 4;

  constructor() {
    this.board = this.generateEmptyBoard();
    this.dropChip = this.dropChip.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidRender() {
    this.validateWinner();
  }

  generateEmptyBoard = () => {
    const nextBoard = new Array(this.maxX + 1).fill(null);
    for (let i = 0; i < nextBoard.length; i++) {
      nextBoard[i] = new Array(this.maxY + 1).fill(null);
    }
    return nextBoard;
  }

  dropChip(e: CustomEvent<number>) {
    const COL = e.detail;
    if (!this.winner && this.canDropChipAtCol(COL)) {
      const nextBoard = JSON.parse(JSON.stringify(this.board));
      const lastDropped: boardCoordinate = {
        COL,
        ROW: this.findAvailableSpaceAtCol(COL)
      };
      nextBoard[lastDropped.COL][lastDropped.ROW] = this.turn;
      Object.assign(this, {
        board: nextBoard,
        lastDropped,
        turn: this.getNextTurn(),
      });
    }
  }

  findAvailableSpaceAtCol(COL) {
    let ROW = 0;
    while (ROW <= this.maxY) {
      if (this.board[COL][ROW + 1] !== null || ROW === this.maxY) {
        return ROW;
      }
      ROW++;
    };
  }

  canDropChipAtCol = (COL: number) => !this.board[COL][0];

  getNextTurn = () => this.turn === chip.red ? chip.blue : chip.red

  shouldHighlightSlot = (COL, ROW) => this.slotInWinningVector(COL, ROW) || this.slotIsLastDropped(COL, ROW);

  slotIsLastDropped = (COL, ROW) =>
    this.lastDropped &&
    COL === this.lastDropped.COL &&
    ROW === this.lastDropped.ROW;

  slotInWinningVector = (COL, ROW) => this.winner &&
    !!this.winningVector.find(position => position.COL === COL && position.ROW === ROW);

  renderBoardSlots() {
    const slots = [];
    for (let ROW = 0; ROW <= this.maxY; ROW++) {
      for (let COL = 0; COL <= this.maxX; COL++) {
        slots.push(
          <mt-connect-slot
            highlighted={this.shouldHighlightSlot(COL, ROW)}
            col={COL}
            value={this.board[COL][ROW]}
            onSelectSlot={this.dropChip} />
        );
      }
    }
    return slots;
  }

  reset = () => Object.assign(this, {
    winner: null,
    turn: this.winner,
    board: this.generateEmptyBoard(),
    lastDropped: null,
    winningVector: [],
  })

  renderWinner() {
    return !this.winner ? null :
      [
        <hr />,
        <h1>WINNER: {this.getChipColor(this.winner)}</h1>,
        <br />,
        <div style={{ textAlign: 'center' }}>
          <button onClick={this.reset}
            style={{ fontSize: '2rem', padding: '5.5rem 2rem', backgroundColor: 'green', color: 'white', borderRadius: '50%' }}
          >RESTART</button>
        </div>,
      ];
  }

  validateWinner = () => {
    for (let COL = 0; (COL <= this.maxX); COL++) {
      for (let ROW = this.maxY; ROW >= 0; ROW--) {
        this.validateWinnerPosition(COL, ROW);
      }
    }
  }

  validateWinnerPosition(COL, ROW) {
    if (!!this.board[COL][ROW] && !this.winner) {
      if (this.shouldSearchRight(COL)) {
        this.validateVector(COL, ROW, 1, 0, 1);
      }
      if (this.shouldSearchRight(COL) && this.shouldSearchUp(ROW)) {
        this.validateVector(COL, ROW, 1, -1, 1);
      }
      if (this.shouldSearchUp(ROW)) {
        this.validateVector(COL, ROW, 0, -1, 1);
      }
      if (this.shouldSearchLeft(COL) && this.shouldSearchUp(ROW)) {
        this.validateVector(COL, ROW, -1, -1, 1);
      }
    }
  }

  validateVector(
    COL: number,
    ROW: number,
    deltaCOL: number,
    deltaROW:
      number,
    count: number,
    searchStack: boardCoordinate[] = []) {
    if (!searchStack.length) {
      searchStack.push({ COL, ROW });
    }
    const currentVal = this.board[COL][ROW];
    if (!!currentVal && this.nextValueIsEqual(COL, ROW, deltaCOL, deltaROW)) {
      searchStack.push({ COL: COL + deltaCOL, ROW: ROW + deltaROW });
      const nextCount = count + 1;
      if (nextCount >= this.connect) {
        // @TODO: avoid re-rendering here
        Object.assign(this, {
          winner: currentVal,
          winningVector: searchStack
        })
        this.winner = currentVal;
        return currentVal;
      } else {
        return this.validateVector(
          COL + deltaCOL,
          ROW + deltaROW,
          deltaCOL,
          deltaROW,
          nextCount,
          searchStack);
      }
    }
    return false
  }

  nextValueIsEqual = (COL, ROW, deltaCOL, deltaROW) =>
    this.board[COL][ROW] === this.board[COL + deltaCOL][ROW + deltaROW]

  shouldSearchLeft = moize((COL) => COL >= this.connect - 1);
  shouldSearchRight = moize((COL) => COL < this.maxX - (this.maxX - this.connect));
  shouldSearchUp = moize((ROW) => ROW >= this.connect - 1);

  getChipColor = moize((chipColor: chip) => chipColor === chip.red ? '🔴' : '🔵');

  render() {
    return (
      <Host>
        <h1>Turn: {this.getChipColor(this.turn)}</h1> <br />
        <div class="board-container">
          {this.renderBoardSlots()}
        </div>
        {this.renderWinner()}
      </Host>
    );
  }
}
