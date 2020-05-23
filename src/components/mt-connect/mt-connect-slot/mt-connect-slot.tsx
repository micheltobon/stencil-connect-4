import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import type { boardPosition } from '../../../helpers/model';

@Component({
  tag: 'mt-connect-slot'
})
export class MtBoardSlot {

  constructor() {
    this.handleSlotClick = this.handleSlotClick.bind(this);
  }

  @Prop() col: number;

  @Prop() value: boardPosition = null;

  @Prop() highlighted: boolean;

  @Event() selectSlot: EventEmitter;

  private handleSlotClick = () => this.selectSlot.emit(this.col);

  private getHighlightedClass = () => !this.highlighted ? '' : 'highlight';

  private getChipColorClass = () => this.value === null ? '' : this.value;

  private getClassName = () => `chip ${this.getChipColorClass()} ${this.getHighlightedClass()}`

  render() {
    return <Host class="board-slot" onClick={this.handleSlotClick}>
      <div class={this.getClassName()}></div>
    </Host>;
  }
}
