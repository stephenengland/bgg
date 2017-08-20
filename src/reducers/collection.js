export const COLLECTION_LOAD_START = 'COLLECTION_LOAD_START';
export const A_COLLECTION_LOAD_END = 'COLLECTION_LOAD_END';

const POLL_TIME_HALF_VARIANCE = 5000;

function createLabel (item) {
    if (item.minimumPlayers !== item.maximumPlayers) {
        item.label = item.minimumPlayers + " to " + item.maximumPlayers + " Players";
    }
    else {
        item.label = item.maximumPlayers + " Players";
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

function getPollTime() {
    return POLL_TIME_HALF_VARIANCE * Math.random() + POLL_TIME_HALF_VARIANCE;
}

function fetchCollection(user) {
    return fetch("http://localhost:9002/collection/" + user)
        .then(response => response.json());
};

function delayPromiseByPollTime(resolve) {
    setTimeout(resolve, getPollTime());
}

function pollCollection(user, dispatch) {
    function pollCollectionRecursive() {
        return fetchCollection(user)
            .then(json => {
                dispatch({
                    type: A_COLLECTION_LOAD_END,
                    user: user,
                    newItems: json.games,
                    stillUpdating: json.updating
                });

                if (json.updating) {
                    return new Promise(delayPromiseByPollTime)
                        .then(pollCollectionRecursive);
                }
            });
    }

    return pollCollectionRecursive();
};

export function loadCollection() {
    return (dispatch, getState) => {
        const users = getState().users.items;
        dispatch({
            type: COLLECTION_LOAD_START,
            users: users
        });

        let promises = users.map(function (user) {
            return pollCollection(user, dispatch);
        });
        
        return Promise.all(promises);
    };
}