import { faker } from '@faker-js/faker';



// This ensures that every time you run this specific test, 
// Faker generates the exact same "random" data.
//faker.seed(123);


export const generateUser = () => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    fullName: faker.person.fullName(),
    address: faker.location.streetAddress(),
    phoneNumber: faker.phone.number(),
    // company: faker.company.name(),
    // This removes everything EXCEPT letters, numbers, and spaces
     company: faker.company.name().replace(/[^a-z0-9 ]/gi, ''),
     jobTitle: faker.person.jobTitle(), 
     

  };
};