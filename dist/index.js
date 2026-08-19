// src/buttons.html
var buttons_default = `<template data-template="toggle-all">
  <div class="toggleAllMembersButtons">
    <div class="menu_button fa-solid fa-comment" data-action="enableAll" title="Enable auto-replies from all members"></div>
    <div class="menu_button fa-solid fa-comment-slash" data-action="disableAll" title="Disable auto-replies from all members"></div>
  </div>
</template>
<template data-template="show-enabled-only">
  <div class="tag actionable interactable showEnabledOnlyButton fa-solid fa-user-check" data-action="showEnabledOnly" title="Show enabled members only" aria-label="Show enabled members only" aria-pressed="false"></div>
</template>
`;

// src/index.ts
async function toggleAll(disabled) {
  const ctx = SillyTavern.getContext();
  const groupId = ctx.groupId;
  if (!groupId)
    return;
  const group = ctx.groups.find((g) => g.id === groupId);
  if (!group)
    return;
  if (disabled) {
    group.disabled_members = [...group.members];
  } else {
    group.disabled_members = [];
  }
  await fetch("/api/groups/edit", {
    method: "POST",
    headers: ctx.getRequestHeaders(),
    body: JSON.stringify(group)
  });
  $("#currentGroupMembers .group_member").toggleClass("disabled", disabled);
}
function toggleEnabledOnly(control) {
  const container = control.closest("#currentGroupMembers");
  if (!container)
    return;
  const showEnabledMembersOnly = container.classList.toggle("showEnabledMembersOnly");
  control.classList.toggle("selected", showEnabledMembersOnly);
  control.setAttribute("aria-pressed", String(showEnabledMembersOnly));
}
function init() {
  const range = document.createRange();
  const templateFragment = range.createContextualFragment(buttons_default);
  const toggleAllTemplate = templateFragment.querySelector('template[data-template="toggle-all"]');
  const showEnabledOnlyTemplate = templateFragment.querySelector('template[data-template="show-enabled-only"]');
  document.querySelectorAll("#currentGroupMembers").forEach((container) => {
    const header = container.querySelector("#rm_group_members_header");
    if (!header)
      return;
    if (toggleAllTemplate) {
      container.insertBefore(toggleAllTemplate.content.cloneNode(true), header);
    }
    const toolbar = header.nextElementSibling;
    if (!showEnabledOnlyTemplate || !toolbar?.matches(".rm_tag_controls"))
      return;
    const filter = toolbar.querySelector(".rm_tag_filter");
    if (!filter)
      return;
    const insertEnabledOnlyControl = () => {
      const clearFilters = filter.querySelector(".clearAllFilters");
      if (clearFilters && !filter.querySelector("[data-action=showEnabledOnly]")) {
        clearFilters.after(showEnabledOnlyTemplate.content.cloneNode(true));
      }
    };
    insertEnabledOnlyControl();
    new MutationObserver(insertEnabledOnlyControl).observe(filter, { childList: true });
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element))
      return;
    if (target.matches(".toggleAllMembersButtons [data-action=enableAll]")) {
      event.stopPropagation();
      toggleAll(false);
    } else if (target.matches(".toggleAllMembersButtons [data-action=disableAll]")) {
      event.stopPropagation();
      toggleAll(true);
    } else if (target.matches("[data-action=showEnabledOnly]")) {
      event.stopPropagation();
      toggleEnabledOnly(target);
    }
  });
}
var ctx = SillyTavern.getContext();
ctx.eventSource.on(ctx.eventTypes.APP_READY, init);
