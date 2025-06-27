import { createContext } from "react";

export const DataContext = createContext()

export const defaultValue = {
  lopHocPhanData: [],
  giangVienData: [],
  hocPhanData: [],
  hocKiData: []
}

export function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'updateLopHocPhanData':
      return { ...state, lopHocPhanData: payload }

    case 'updateGiangVienData':
      return { ...state, giangVienData: payload }

    case 'updateHocPhanData':
      return { ...state, hocPhanData: payload }

    case 'updateHocKiData':
      return { ...state, hocKiData: payload }
  }
}