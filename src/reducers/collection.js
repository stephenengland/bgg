export default function collection(state = [], action) {
    switch (action.type) {
        case 'COLLECTION_LOAD':
            return [
                ...state,
                {
                    "name": "7 Wonders"
                },
                {
                    "name": "Cards Against Humanity"
                },
                {
                    "name": "Pathfinder"
                }
            ];
        default:
            return state;
    }
}

export function loadCollection() {
    return {
        type: "COLLECTION_LOAD"
    };
}