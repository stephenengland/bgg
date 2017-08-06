export default function user(state = {}, action) {
    switch (action.type) {
        case 'USER_LOAD':
            console.log("Load User:" + action.selectedUser);
            return state;
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