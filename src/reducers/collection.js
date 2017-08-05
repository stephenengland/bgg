function createLabel (item) {
    if (item.minplayers !== item.maxplayers) {
        item.label = item.minplayers + " to " + item.maxplayers + " Players";
    }
    else {
        item.label = item.maxplayers + " Players";
    }
}

export default function collection(state = [], action) {
    switch (action.type) {
        case 'COLLECTION_LOAD':
            var newItems = [
                {
                    name: "7 Wonders",
                    thumbnail: "https://cf.geekdo-images.com/images/pic860217_t.jpg",
                    minplayers: 2,
                    maxplayers: 7
                },
                {
                    name: "Cards Against Humanity",
                    thumbnail: "https://cf.geekdo-images.com/images/pic2909692_t.jpg",
                    minplayers: 4,
                    maxplayers: 30
                },
                {
                    name: "Castles Of Burgundy",
                    thumbnail: "https://cf.geekdo-images.com/images/pic1176894_t.jpg",
                    minplayers: 2,
                    maxplayers: 4
                }
            ];

            newItems.forEach(createLabel);

            return [
                ...state,
                ...newItems
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