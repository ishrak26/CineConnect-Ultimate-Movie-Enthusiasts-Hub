const supabase = require('../config/supabaseConfig');

async function createUser(user) {
    const { data, error } = await supabase
        .from('user_info')
        .insert({
            username: user.username,
            email: user.email,
            password: user.password,
            full_name: user.full_name,
        })
        .select('id, username, email, full_name, role');

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

async function findOne({ username }) {
    const { data, error } = await supabase
        .from('user_info')
        .select('id, password, username')
        .eq('username', username);

    if (error) {
        console.error(error);
        return null;
    }

    if (data) {
        return data[0];
    }
}

module.exports = {
    createUser,
    findOne,
};
