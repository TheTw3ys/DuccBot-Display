import fs from "fs";
import {
  LogUser,
  CurrentState,
  LogStates,
  Ranking,
  Ranks,
  FullCurrentState,
  FullLogStates,
  FullUser,
} from "../lib/types";
import path from "path";

export const states: LogStates = {};
export const ranking: Ranking = {};
export const fullState: FullLogStates = {};

function readUserLog(userLogPath) {
  const files = fs.readdirSync(userLogPath);
  files.forEach((userFile) => {
    let file = path.resolve(path.normalize(`${userLogPath}/${userFile}`));
    let data = JSON.parse(fs.readFileSync(file).toString());
    const state: CurrentState = {
      logname: userFile.toString().slice(0, -5),
      updatedAt: new Date(),
      users: {},
    };
    Object.keys(data).forEach((userSnippet) => {
      const userData = data[userSnippet];
      if (userData["experience"] === 5) return; // to reduce it to members who actually wrote something

      const user: LogUser = {
        id: parseInt(userData["id"]),
        name: userData["name"],
        experience: parseInt(userData["experience"]),
        level: parseInt(userData["level"]),
      };

      state.users[userData["id"]] = user;
      states[userFile.toString().slice(0, -5)] = state;
    });
  });
}

function rankUsers() {
  Object.keys(states).map((logname) => {
    let state = states[logname];
    let items = Object.keys(state.users).map(function (key) {
      return [key, state.users[key].experience];
    });
    let itemObject = {};
    items.forEach((item) => {
      itemObject[item[0]] = item[1];
    });
    let ItemObjectArray = Object.keys(itemObject).map(function (key) {
      return [key, itemObject[key]];
    });
    ItemObjectArray = ItemObjectArray.sort(function (first, second) {
      return second[1] - first[1];
    });

    let ranks: Ranks = {};
    for (let x = 1; x < ItemObjectArray.length + 1; x++) {
      ranks[x] = ItemObjectArray[x - 1][0];
    }
    ranking[logname] = ranks;
    return ranks;
  });
}
function appendUsers() {
  Object.keys(states).map((logname) => {
    let users = states[logname].users;
    let ranks = ranking[logname];
    //console.log(users,"\r\n", ranks)
    const state: FullCurrentState = {
      logname: logname,
      updatedAt: new Date(),
      users: {},
    };

    for (let x = 1; x < Object.entries(ranks).length + 1; x++) {
      Object.keys(users).map((user) => {
        // TODO too many LOOPS
        if (ranks[x].toString() === user) {
          let fullUser: FullUser = {
            id: users[user].id,
            name: users[user].name,
            experience: users[user].experience,
            level: users[user].level,
            rank: x,
          };
          state.users[user] = fullUser;
          fullState[logname] = state;
        }
      });
    }
  });
}

export function parseLogs(userLogPath: string, FILE_OS_TYPE) {
  readUserLog(userLogPath);
  rankUsers();
  appendUsers();
}
