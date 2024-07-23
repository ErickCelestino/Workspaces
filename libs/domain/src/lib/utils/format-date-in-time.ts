export function FormatDateInTime(time: Date) {
  const horas: number = time.getHours();
  const minutos: number = time.getMinutes();
  return `${horas < 10 ? `0${horas}` : horas}:${
    minutos === 0 ? '00' : minutos
  }`;
}
