import { ITime } from '../../models/time';

export function timeStringToObject(timeString: string): ITime {
  if(!timeString){
    return   {hours: 0, minutes: 0};
  }

  const [time, modifier] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  let formattedHours: number = hours;

  if (modifier === 'PM' && hours !== 12) {
    formattedHours += 12;
  }

  if (modifier === 'AM' && hours === 12) {
    formattedHours = 0;
  }

  return {hours: formattedHours, minutes};
}
