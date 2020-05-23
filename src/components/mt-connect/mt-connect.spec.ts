import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { MtConnect } from './mt-connect.tsx';

describe('tests the connect 4 game', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [ MtConnect ],
      html: '<mt-connect></mt-connect>'
    });
    await page.waitForChanges();
  });

  const dropChipsAt = async (cols: number[]) => {
    for(let i = 0; i < cols.length; i++){
      await dropChipAtCol(cols[i]);
    }
  }

  const dropChipAtCol = async (COL: number) => {
    const selectSlotEvent = new CustomEvent('selectSlot', {
      detail: COL
    });
    page.root.querySelector(`.board-container`)
      .childNodes[COL]
      .dispatchEvent(selectSlotEvent);
    await page.waitForChanges();
  }

  it('Renders the board', async () => {
    const allSlots = page.root.querySelectorAll('mt-connect-slot');
    expect(allSlots).toHaveLength(42);
  });

  it('Drops chips on the first column until full', async () => {
    const targetCol = 0;
    const turnContainer = page.doc.querySelector('h1');
    expect(turnContainer.innerText).toBe('Turn: 🔴');

    const allSlotsInCol_0 = page.doc.querySelectorAll(`mt-connect-slot[col="${targetCol}"]`);
    expect(allSlotsInCol_0).toHaveLength(6);

    for(let targetSlot of allSlotsInCol_0){
      await dropChipAtCol(targetSlot.getAttribute('col'));
    }
    expect(turnContainer.innerText).toBe('Turn: 🔴');
    await dropChipAtCol(1);
    await dropChipAtCol(0);
    expect(turnContainer.innerText).toBe('Turn: 🔵');
  });

  it('🔴 wins at col 0, then resets', async () => {
    const drops = [
      0,1,
      0,1,
      0,1,
      0,1,
    ];
    await dropChipsAt(drops);
    const allH1s = page.root.querySelectorAll('h1');
    expect(allH1s).toHaveLength(2);
    expect(allH1s[1].innerText).toBe('WINNER: 🔴');
    const resetButton = page.root.querySelector('button');
    expect(resetButton).toBeTruthy();
    resetButton.click();
    await page.waitForChanges();
    expect(page.root.querySelectorAll('h1')).toHaveLength(1);
  });

  it('🔴 wins on col 6', async () => {
    const drops = [
      6,5,
      6,5,
      6,5,
      6,5,
    ];

    await dropChipsAt(drops);
    const winner = page.root.querySelectorAll('h1')[1];
    expect(winner.innerText).toBe('WINNER: 🔴');

  });

  it('🔵 wins on col 1', async () => {
    const drops = [
      0,1,
      2,1,
      0,1,
      0,1,
    ];

    await dropChipsAt(drops);
    const winner = page.root.querySelectorAll('h1')[1];
    expect(winner.innerText).toBe('WINNER: 🔵');

  });
});
