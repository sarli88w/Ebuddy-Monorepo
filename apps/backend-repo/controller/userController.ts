import { userRepository, userSelectKeys } from "../repository";

export const updateUserData = async (req: any, res: any) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await userRepository.update(user);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
}

export const fetchUserData = async (req: any, res: any) => {
  try {
    const users = await userRepository
      .orderByDescending('totalAverageWeightRatings')
      .orderByDescending('numberOfRents')
      .orderByDescending('recentlyActive')
      .find();

    const resData = userSelectKeys(users).filter(user => user.email != req.user.email);

    res.status(200).json({
      status: 'success',
      data: resData,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
}
