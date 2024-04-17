export function setUserIdLocalStorage(id: string | undefined) {
  localStorage.setItem('ui', JSON.stringify(id));
}
