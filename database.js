import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'create table if not exists menuitems (id integer primary key not null, name text, description text, image text, price text, category text);'
                );
            },
            reject,
            resolve
        );
    });
}

export async function getMenuItems() {
    return new Promise((resolve) => {
        db.transaction(
            (tx) => {
                tx.executeSql('select * from menuitems', [], (_, { rows }) => {
                    resolve(rows._array);
                });
            }
        );
    });
}

export function saveMenuItems(menuItems) {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    `insert into menuitems (name, description, image, price, category) values ${menuItems
                        .map((item) =>
                            `("${item.name}", "${item.description}", "${item.image}", "${item.price}", "${item.category}")`)
                        .join(', ')}`
                );
            },
            reject,
            resolve
        );
    });
}

export async function filterByCategories(activeCategories, query) {
    return new Promise((resolve) => {
        db.transaction(
            (tx) => {
                const categoryStr = activeCategories.join("','");
                const queryStr = `%${query}%`;
                tx.executeSql(`select * from menuitems where name like '${queryStr}' and category in ('${categoryStr}')`, [], (_, { rows }) => {
                    resolve(rows._array);
                });
            }
        );
    });
}

export const deleteDish = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql('delete from menuitems');
            },
            reject,
            resolve
        );
    });
};