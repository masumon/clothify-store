export const FLOATING_PANEL_EVENT = "clothify-floating-panel-state";

export function emitFloatingPanelState(sumonixOpen: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(FLOATING_PANEL_EVENT, {
      detail: { sumonixOpen },
    })
  );
}

export function isCriticalCommercePath(pathname: string) {
  return ["/checkout", "/payment", "/order-success"].some((segment) =>
    pathname.startsWith(segment)
  );
}

export function isLowPriorityFloatingHiddenPath(pathname: string) {
  return isCriticalCommercePath(pathname) || pathname.startsWith("/help");
}
