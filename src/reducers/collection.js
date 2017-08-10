export const COLLECTION_LOAD_START = 'COLLECTION_LOAD_START';
export const A_COLLECTION_LOAD_END = 'COLLECTION_LOAD_END';

function createLabel (item) {
    if (item.minplayers !== item.maxplayers) {
        item.label = item.minplayers + " to " + item.maxplayers + " Players";
    }
    else {
        item.label = item.maxplayers + " Players";
    }
}

function getUserCollection(user) {
    return user.collection;
};

function combineArrays(a, b) {
    return a.concat(b);
};

export default function collection(state = {
    users: [],
    items: []
}, action) {
    switch (action.type) {
        case COLLECTION_LOAD_START:
            var users = [];
            action.users.forEach(u => users.push({
                name: u,
                loading: true,
                collection: []
            }));
            return {
                ...state,
                users: users,
                items: [],
                loading: true
            };
        case A_COLLECTION_LOAD_END:
            action.newItems.forEach(createLabel);
            var newUsers = state.users.map(item => {
                if (item.name === action.user) {
                    return {
                        ...item,
                        loading: false,
                        collection: action.newItems
                    };
                }
                else {
                    return item;
                }
            });
            
            return {
                ...state,
                users: newUsers,
                items: newUsers.map(u => u.collection).reduce(combineArrays),
                loading: newUsers.map(u => u.loading).includes(true)
            };
        default:
            return state;
    }
}

export function loadCollection() {
    return (dispatch, getState) => {
        const users = getState().users.items;
        dispatch({
            type: COLLECTION_LOAD_START,
            users: users
        });

        let promises = [];
        users.forEach(function (user) {
            promises.push(fetch("http://www.localhost:9001/collection/" + user)
                .then(response => response.json())
                .then(json => dispatch({
                    type: A_COLLECTION_LOAD_END,
                    user: user,
                    newItems: json.games,
                    stillUpdating: json.updating
                })));
        });
        
        return Promise.all(promises);
    };
}