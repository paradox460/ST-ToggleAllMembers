import './style.css'
import rawControlTemplate from './buttons.html' with { type: 'text' }

declare const SillyTavern: {
  getContext(): {
    groupId: string | null;
    groups: Array<{
      id: string;
      members: string[];
      disabled_members: string[];
    }>;
    getRequestHeaders(): Record<string, string>;
    eventSource: {
      on(event: string, callback: () => void): void;
    };
    eventTypes: {
      APP_READY: string;
    };
  };
};

declare const $: (selector: string) => {
  toggleClass(className: string, state: boolean): void;
};

async function toggleAll(disabled: boolean): Promise<void> {
  const ctx = SillyTavern.getContext();
  const groupId = ctx.groupId;
  if (!groupId) return;

  const group = ctx.groups.find(g => g.id === groupId);
  if (!group) return;

  if (disabled) {
    group.disabled_members = [...group.members];
  } else {
    group.disabled_members = [];
  }

  await fetch('/api/groups/edit', {
    method: 'POST',
    headers: ctx.getRequestHeaders(),
    body: JSON.stringify(group),
  });

  $('#currentGroupMembers .group_member').toggleClass('disabled', disabled);
}


function init(): void {
  const range = document.createRange();
  const templateFragment = range.createContextualFragment(rawControlTemplate);

  document.querySelectorAll("#currentGroupMembers").forEach((container: HTMLElement | Element) => {
    if (!container) return;

    const header = container.querySelector('#rm_group_members_header');
    if (!header) return;

    const buttonBar = templateFragment.cloneNode(true) as HTMLElement;
    container.insertBefore(buttonBar, header);
  });
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.matches('.toggleAllMembersButtons [data-action=enableAll]')) {
      event.stopPropagation();
      toggleAll(false);
    } else if (target.matches('.toggleAllMembersButtons [data-action=disableAll]')) {
      event.stopPropagation();
      toggleAll(true);
    }
  });
}

const ctx = SillyTavern.getContext();
ctx.eventSource.on(ctx.eventTypes.APP_READY, init);
