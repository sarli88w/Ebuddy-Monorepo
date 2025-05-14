import { getRepository } from "fireorm";
import moment from "moment";
import { hashPassword } from "../utils";
import { User } from "../entities";

const users = [
  {
    username: "superadmin",
    name: "Super Admin",
    email: "superadmin@ebuddy.com",
    email_verified: true,
    password: hashPassword("pass1234"),
    totalAverageWeightRatings: (Math.random() * 9 + 1).toFixed(2),
    numberOfRents: (Math.floor(Math.random() * 30) + 1),
    recentlyActive: moment().valueOf(),
  },
  {
    username: "usera",
    name: "User A",
    email: "usera@ebuddy.com",
    password: hashPassword("pass1234"),
    totalAverageWeightRatings: (Math.random() * 9 + 1).toFixed(2),
    numberOfRents: (Math.floor(Math.random() * 30) + 1),
    recentlyActive: moment().add(1, 'days').valueOf(),
  },
  {
    username: "userb",
    name: "User B",
    email: "userb@ebuddy.com",
    password: hashPassword("pass1234"),
    totalAverageWeightRatings: (Math.random() * 9 + 1).toFixed(2),
    numberOfRents: (Math.floor(Math.random() * 30) + 1),
    recentlyActive: moment().add(2, 'days').valueOf(),
  },
  {
    username: "userc",
    name: "User C",
    email: "userc@ebuddy.com",
    password: hashPassword("pass1234"),
    totalAverageWeightRatings: (Math.random() * 9 + 1).toFixed(2),
    numberOfRents: (Math.floor(Math.random() * 30) + 1),
    recentlyActive: moment().add(3, 'days').valueOf(),
  },
];

export const seedUsers = async (firebaseAdmin: any) => {
  const repository = getRepository(User);

  for (const user of users) {
    try {
      const record = await firebaseAdmin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.name,
      });

      await repository.create({
        id: record.uid,
        username: user.username,
        name: record.displayName,
        email: record.email,
        password: user.password,
        totalAverageWeightRatings: Number(user.totalAverageWeightRatings),
        numberOfRents: Number(user.numberOfRents),
        recentlyActive: Number(user.recentlyActive),
      });

      console.log(`Add ${user.username} success`);
    } catch (err: any) {
      console.error(`Add ${user.username} failed`, err.message);
    }
  }
  
  process.exit();
}
