import { Pool } from "pg";

const pool: Pool = new Pool({
    user: 'saul_bard',
    host: 'localhost',
    database: 'remnd_me',
    password: 'saul',
    port: 5432
});

const getAllUsers = (): Promise<any> => {

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
            if (error) {
                reject (error);
            }
    
            resolve(results.rows);
        });
    })
}

const getUserByExternalRef = (externalRef: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users where external_ref= $1', [externalRef], (error, results) => {
            if (error) {
                reject(new Error(error.message));
            }
            
            if (results) {
                if (results.rowCount === 0) {
                    reject(new Error("No User Found"));
                }
                resolve(results.rows[0]);
            }  else {
                reject(new Error("No User Found"));
            }
        });
    });
}

const getUserByUsername = (username: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users where username= $1', [username], (error, results) => {
            if (error) {
                reject(new Error(error.message));
            }
            
            if (results) {
                if (results.rowCount === 0) {
                    reject(new Error("No User Found"));
                }
                resolve(results.rows[0]);
            }  else {
                reject(new Error("No User Found"));
            }
        });
    });
}

const createUser = (username: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
            if (error) {
                reject (new Error(error.message));
            }

            resolve(results.rows[0]);
        })
    })
}

const updateUser = (user: any) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET username = $1 WHERE external_ref = $2 RETURNING *',[user.username, user.externalRef], async (error, results) => {
            if (error) {
                reject (new Error(error.message));
            }
            resolve(results);
        })
    })
}

const deleteUser = (externalRef: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE external_ref = $1', [externalRef], (error, results) => {
            if (error) {
                reject(new Error(error.message));
            }

            resolve(results);
        })
    })
}

const userDb = {
    getAllUsers,
    getUserByExternalRef,
    createUser,
    updateUser,
    deleteUser,
    getUserByUsername
}

export default userDb;