export const MAX_SIGNUP_AGE = 120;

export type BirthDateValidationResult = 'incomplete' | 'invalid' | 'too-old' | 'valid';

export const validateBirthDate = (
  yearValue: string,
  monthValue: string,
  dayValue: string,
  currentDate = new Date()
): BirthDateValidationResult => {
  if (yearValue.length !== 4 || !monthValue || !dayValue) return 'incomplete';

  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const birthDate = new Date(currentDate);

  birthDate.setHours(0, 0, 0, 0);
  birthDate.setFullYear(year, month - 1, day);

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate >= today
  ) {
    return 'invalid';
  }

  let age = today.getFullYear() - year;
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;

  return age > MAX_SIGNUP_AGE ? 'too-old' : 'valid';
};

export const calculateAge = (birthDateString: string, currentDate = new Date()): number => {
  const birthDate = new Date(birthDateString);
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;

  return age;
};