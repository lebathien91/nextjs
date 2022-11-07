import { ACTIONS } from "./Actions";

export interface IGlobalState {
  notify: object;
  auth: object;
}

const Reducers = (
  state: IGlobalState,
  action: { type: string; payload: object }
) => {
  switch (action.type) {
    case ACTIONS.NOTIFY:
      return {
        ...state,
        notify: action.payload,
      };
    case ACTIONS.AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case ACTIONS.SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    default:
      return state;
  }
};

export default Reducers;
