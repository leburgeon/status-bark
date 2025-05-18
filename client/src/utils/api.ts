import store from "../store"
import { showError } from "../reducers/uiSlice"

export async function apiRequest<T>(fn: () => Promise<T>){
  try {
    console.log('hereis')
    return await fn()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('here')
    const message = error.response?.data?.error || error.message || 'Unexpected Error'
    console.log(message)
    store.dispatch(showError(message))
    throw error
  }
}