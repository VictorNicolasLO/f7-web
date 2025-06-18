// performanceTest.ts
// Performance test for Flash7Api: creates 1001 users, 1000 follow 1, main user posts 1000 times

import { ulid } from 'ulid';
import { Flash7Api } from './flash7Api';

const BASE_URL = 'http://143.198.244.134'; // Change to your API base URL
const USERNAME_PREFIX = 'testuser';
const PASSWORD = 'testpass';
const MAIN_USER_INDEX = 0;
const NUM_USERS = 1001;
const TEST_NAME_POST = 'test x';
// const NUM_USERS = 1;

const NUM_POSTS = 0;

async function createAndActivateUser(
  api: Flash7Api,
  username: string,
  password: string,
) {
  const authRes = await api.auth(username, password);
  console.log(`User created: ${username}`);
  const jwt = authRes.jwt || authRes.accessToken || authRes.token;
  api.setAuthTokens(async () => jwt);
  await api.activateUser(jwt);
  return { jwt, userId: authRes.refreshToken.userIdB64 };
}

async function main() {
  const users: { username: string; password: string; jwt: string, userId: string }[] = [];
  console.time('Create and activate users');
  // 1. Create and activate users
  // for (let i = 0; i < NUM_USERS; i++) {
  //   const username = `${USERNAME_PREFIX}${i}`;
  //   const api = new Flash7Api({ baseUrl: BASE_URL });
  //   try {
  //     const jwt = await createAndActivateUser(api, username, PASSWORD);
  //     users.push({ username, password: PASSWORD, jwt });
  //     if (i % 100 === 0) console.log(`Created user ${i}`);
  //     // Optional: sleep to avoid rate limiting
  //     // if (i % 50 === 0) await sleep(200);
  //   } catch (e) {
  //     console.error(`Error creating user ${i}:`, e);
  //   }
  // }
  // console.timeEnd('Create and activate users');

  // create users in parallel
  let usersCounter = 0;
  const userPromises = Array.from({ length: NUM_USERS }, async (_, i) => {
    const username = `${USERNAME_PREFIX}${i}`;
    const api = new Flash7Api({ baseUrl: BASE_URL });
    try {
      const { jwt, userId } = await createAndActivateUser(api, username, PASSWORD);
      users.push({ username, password: PASSWORD, jwt, userId: userId });
      usersCounter++;
      if (usersCounter % 100 === 0)
        console.log(`Created user ${usersCounter}`);
      // Optional: sleep to avoid rate limiting
      // if (i % 50 === 0) await sleep(200);
    } catch (e) {
      console.error(`Error creating user ${i}:`, e);
    }
  });
  await Promise.all(userPromises);
  console.timeEnd('Create and activate users');
  console.log(`Total users created: ${users.length}`);

  // 2. 1000 users follow the main user
  const mainUser = users[MAIN_USER_INDEX];
  const mainUserKey = mainUser.userId; // Adjust if userKey is different
  console.time('Followers');
  await Promise.all(
    users.slice(1).map(async (user, idx) => {
      const api = new Flash7Api({ baseUrl: BASE_URL });
      api.setAuthTokens(async () => user.jwt);
      try {
        await api.follow(mainUserKey);
        if (idx % 100 === 0)
          console.log(`User ${user.username} followed main user`);
      } catch (e) {
        console.error(`Error: ${user.username} follow main user`, e);
      }
    }),
  );
  console.timeEnd('Followers');

  // 3. Main user posts 1000 times
  const mainApi = new Flash7Api({ baseUrl: BASE_URL });
  mainApi.setAuthTokens(async () => mainUser.jwt);
  console.time('Main user posts');
  //   for (let i = 0; i < NUM_POSTS; i++) {
  //     try {
  //       await mainApi.post(`postkey${i}`, `This is post number ${i}`);
  //       if (i % 100 === 0) console.log(`Main user posted ${i}`);
  //       // Optional: sleep(10) to avoid rate limiting
  //     } catch (e) {
  //       console.error(`Error posting ${i}:`, e);
  //     }
  //   }

  let postsCounter = 0;
  const postPromises = Array.from({ length: NUM_POSTS }, async (_, i) => {
    try {
      await mainApi.post(ulid(), `This is post number ${i}`);
      postsCounter++;
      if (postsCounter % 100 === 0)
        console.log(`Main user posted ${postsCounter}`);
    } catch (e) {
      console.error(`Error posting ${i}:`, e);
    }
  });
  await Promise.all(postPromises);

  console.timeEnd('Main user posts');

  console.log('Performance test complete.');
}

main().catch(console.error);
