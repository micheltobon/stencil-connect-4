import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { MtBoardSlot } from './mt-connect-slot';
import { chip } from '../../../helpers/model'

describe('<mt-connect-slot>', () => {
  let page: SpecPage;
  let boardSlot;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [ MtBoardSlot ],
      html: '<mt-connect-slot col="0"></mt-connect-slot>'
    });
  })

  it('renders a basic slot', async () => {
    expect(page.root.innerHTML).toEqualHtml(`<div class="chip"></div>`);
  });

  it('renders a red or blue chip', async () => {
    const theChip = page.root.firstChild;

    page.root.value = chip.red;
    await page.waitForChanges();
    expect(theChip).toHaveClass(chip.red);
    expect(theChip).not.toHaveClass(chip.blue);

    page.root.value = chip.blue;
    await page.waitForChanges();
    expect(theChip).toHaveClass(chip.blue);
    expect(theChip).not.toHaveClass(chip.red);
  });

  it('renders a highlighed chip', async () => {
    const theChip = page.root.firstChild;
    expect(theChip).not.toHaveClass('highlight');
    page.root.highlighted = true;
    await page.waitForChanges();
    expect(theChip).toHaveClass('highlight');
  });

  it('emits selectSlot when clicked', () => {
    const selectSlotListener = jest.fn();
    page.win.addEventListener('selectSlot', selectSlotListener);
    page.root.click();

    expect(selectSlotListener).toHaveBeenCalled();
    const detail = selectSlotListener.mock.calls[0][0].detail;
    expect(detail).toBe(0);

  });
});
