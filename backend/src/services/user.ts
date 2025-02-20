import { CreateUserDTO } from '../interface/dto';
import ApiError from '../modules/error';
import { Calendar } from '../interface/entity';
import { Document } from 'mongoose';
import { CalendarService } from './calendar';

async function create(
  calendar_id: string,
  createUserDTO: CreateUserDTO
): Promise<Calendar> {
  const calendar = await CalendarService.getOneDocument(calendar_id);

  calendar.users.push(createUserDTO);

  return calendar.save();
}

function findIndexOrFail(
  calendar: Calendar & Document,
  user_id: string
): number {
  const index = calendar.users.findIndex((user) => {
    const parseId = JSON.stringify(user._id).replace(/"/g, '');
    return parseId === user_id;
  });
  if (index === -1) {
    throw new ApiError(404, `User ${user_id} not found`);
  }
  return index;
}

async function remove(calendar_id: string, user_id: string): Promise<Calendar> {
  const calendar = await CalendarService.getOneDocument(calendar_id);
  const user_index = findIndexOrFail(calendar, user_id);

  calendar.users = calendar.users.filter((_, index) => index !== user_index);

  return calendar.save();
}

export const UserService = {
  create,
  findIndexOrFail,
  remove,
};
