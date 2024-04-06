export function getUserIdLocalStorage() {
  const json = localStorage.getItem('ui');

  if (!json) {
    return null;
  }

  const user = JSON.parse(json);

  return user ?? null;
}
