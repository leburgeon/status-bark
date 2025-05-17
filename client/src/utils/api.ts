import store from "../store"
import { showError } from "../reducers/uiSlice"

export async function apiRequest<T>(fn: () => Promise<T>){
  try {
    return await fn()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Unexpected Error'
    store.dispatch(showError(message))
    throw error
  }
}