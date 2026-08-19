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


function toggleEnabledOnly(control: Element): void {
  const container = control.closest('#currentGroupMembers');
  if (!container) return;

  const showEnabledMembersOnly = container.classList.toggle('showEnabledMembersOnly');
  control.classList.toggle('selected', showEnabledMembersOnly);
  control.setAttribute('aria-pressed', String(showEnabledMembersOnly));
}

function init(): void {
  const range = document.createRange();
  const templateFragment = range.createContextualFragment(rawControlTemplate);
  const toggleAllTemplate = templateFragment.querySelector<HTMLTemplateElement>('template[data-template="toggle-all"]');
  const showEnabledOnlyTemplate = templateFragment.querySelector<HTMLTemplateElement>('template[data-template="show-enabled-only"]');

  document.querySelectorAll('#currentGroupMembers').forEach((container: HTMLElement | Element) => {
    const header = container.querySelector('#rm_group_members_header');
    if (!header) return;

    if (toggleAllTemplate) {
      container.insertBefore(toggleAllTemplate.content.cloneNode(true), header);
    }

    const toolbar = header.nextElementSibling;
    if (!showEnabledOnlyTemplate || !toolbar?.matches('.rm_tag_controls')) return;

    const filter = toolbar.querySelector('.rm_tag_filter');
    if (!filter) return;

    const insertEnabledOnlyControl = (): void => {
      const clearFilters = filter.querySelector('.clearAllFilters');
      if (clearFilters && !filter.querySelector('[data-action=showEnabledOnly]')) {
        clearFilters.after(showEnabledOnlyTemplate.content.cloneNode(true));
      }
    };

    insertEnabledOnlyControl();
    new MutationObserver(insertEnabledOnlyControl).observe(filter, { childList: true });
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
    } else if (target.matches('[data-action=showEnabledOnly]')) {
      event.stopPropagation();
      toggleEnabledOnly(target);
    }
  });
}

const ctx = SillyTavern.getContext();
ctx.eventSource.on(ctx.eventTypes.APP_READY, init);
