import { checkFirebase } from './firebase';
import logger from './logger';

import { findByEmail } from '../dao/user';
import * as RoomDao from '../dao/room';
import { IUser } from '../models/user';
import { Room } from '../models/room';
import { ICabinets } from '../models/cabinet';
import { ITreasures } from '../models/treasure';

export async function getUser(token: string) {
  try {
    const email = await checkFirebase(token);
    const user = await findByEmail(email);
    return user;
  } catch (e) {
    logger.error(e.message);
  }
}

export function getRandomCode() {
  const code =
    Math.random().toString(36).substring(7, 10) +
    Math.random().toString(36).substring(2, 5);
  return code;
}

export async function getRoom(code: string, users?: Array<IUser>) {
  const setting = await RoomDao.getSetting(code);
  const master = await RoomDao.getMaster(code);
  const getUsers = await RoomDao.getUsers(code);
  const result = new Room(code, master, users ? users : getUsers, setting);
  return result;
}

export const MAX_TREASURE_NUM = 30;
export const MAX_CABINET_NUM = 5;
export const INDEX = 'index_';

export function getRandomNum(length: number) {
  const num = Math.floor(Math.random() * length);
  return num;
}
export function getCabinetArray(preId?: string): ICabinets {
  const cabinets: ICabinets = {};
  let maxNum = MAX_CABINET_NUM;
  for (let i = 0; i < maxNum; i++) {
    cabinets[INDEX + i] = {
      state: false,
      treasureCount: 0,
    };
  }
  for (let i = 0; i < 1; i++) {
    if (preId && preId === getRandomNum(maxNum).toString()) {
      i--;
      continue;
    }
    cabinets[INDEX + getRandomNum(maxNum)].state = true;
  }

  return cabinets;
}
export function getTreasureArray(
  length: number,
  maxLength: number,
  treasuresArg: ITreasures
): ITreasures {
  const treasures = treasuresArg;
  let maxNum = maxLength; //50?
  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * maxNum);
    if (treasures[INDEX + randomNum].state === true) {
      i--;
      continue;
    }
    treasures[INDEX + randomNum].state = true;
  }
  return treasures;
}
export function getNewCabinet(preId?: string): string {
  let randomNum = getRandomNum(MAX_CABINET_NUM);
  while (INDEX + randomNum === preId) {
    randomNum = getRandomNum(MAX_CABINET_NUM);
  }
  return INDEX + randomNum;
}
