import { atom } from 'recoil';

export const isOpenState = atom({
  key: 'isOpen',
  default: {
    open: false
  }
});
