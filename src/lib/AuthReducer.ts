const initialState = {}

const reducer = (state: any, action: any) => {
  if (action.type === 'login') {
    return action.payload.user
  }
  if (action.type === 'logout') {
    return initialState
  }
  return state
}

export default {
  initialState,
  reducer,
}
