export default function user(state = [], action) {
    switch (action.type) {
        case 'USER_LOAD':
            return [
                ...state,
                action.selectedUser
            ];
        default:
            return state;
    }
}

export function loadUser(selectedUser) {
    return {
        type: "USER_LOAD",
        selectedUser: selectedUser
    };
}