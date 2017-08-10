import { loadCollection } from "./collection";

export const USER_LOAD = 'USER_LOAD';
export const USER_UNLOAD = 'USER_UNLOAD';

export default function user(state = {
    items: []
}, action) {
    switch (action.type) {
        case USER_LOAD:
            if (!action.selectedUser || state.items.indexOf(action.selectedUser) > -1) {
                return state;
            }

            return {
                ...state,
                items: [...state.items, action.selectedUser]
            };
        case USER_UNLOAD:
            return {
                ...state,
                items: state.items.filter(item => item !== action.selectedUser)
            };
        default:
            return state;
    }
}

export function loadUser(selectedUser) {
    return function(dispatch) {
        dispatch({
            type: USER_LOAD,
            selectedUser: selectedUser
        });
        dispatch(loadCollection());
    };
}

export function unloadUser(selectedUser) {
    return function(dispatch) {
        dispatch({
            type: USER_UNLOAD,
            selectedUser: selectedUser
        });
        dispatch(loadCollection());
    };
}

export function getUserRoute(users) {
    if (!users || !users.items || !users.items.length) {
        return '/';
    }
    return '/users/' + users.items.join(',');
}