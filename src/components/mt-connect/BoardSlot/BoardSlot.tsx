import { FunctionalComponent, h } from '@stencil/core';
import type { boardPosition } from '../../../helpers/model';

export interface BoardSlotProps{
  highlighted: boolean;
  value: boardPosition;
  onClick: () => void
}

export const BoardSlot: FunctionalComponent<BoardSlotProps> = ({
  highlighted,
  value,
  onClick,
}) => {

  const className = `chip ${value === null ? '' : value} ${!highlighted ? '' : 'highlight'}`;
  return <div class="board-slot" onClick={onClick}>
    <div class={className}></div>
  </div>;
}
