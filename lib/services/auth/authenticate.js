// import { retrieveUser } from '../../core/user'

export default async (
  {
    // username
  }
) => {
  try {
    // const err = new Error('Unauthorized');
    // err.status = 401;
    //
    // if (!username) throw err;
    //
    // const user = await retrieveUser({ username });
    // if (user) return user;
    //
    // throw err;
    return { name: 'Foo', username: 'bar' }
  } catch (err) {
    console.error('Error retrieving user:', err)
    throw err
  }
}
