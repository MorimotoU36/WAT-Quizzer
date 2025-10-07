// 指定されたidの<input>要素のvalueを空にする関数
export const clearInputValuesByIds = (ids: string[]): void => {
  ids.forEach((id) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (input && input.tagName === 'INPUT') {
      input.value = '';
    }
  });
};
