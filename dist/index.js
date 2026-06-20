// src/buttons.html
var buttons_default = `<div class="toggleAllMembersButtons">
  <div class="menu_button fa-solid fa-comment" data-action="enableAll" title="Enable auto-replies from all members"></div>
  <div class="menu_button fa-solid fa-comment-slash" data-action="disableAll" title="Disable auto-replies from all members"></div>
</div>
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
function init() {
  const range = document.createRange();
  const templateFragment = range.createContextualFragment(buttons_default);
  document.querySelectorAll("#currentGroupMembers").forEach((container) => {
    if (!container)
      return;
    const header = container.querySelector("#rm_group_members_header");
    if (!header)
      return;
    const buttonBar = templateFragment.cloneNode(true);
    container.insertBefore(buttonBar, header);
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
    }
  });
}
var ctx = SillyTavern.getContext();
ctx.eventSource.on(ctx.eventTypes.APP_READY, init);
