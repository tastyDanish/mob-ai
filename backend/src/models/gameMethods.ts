import Game from "./gameModel";

export const startGame = async (end: number) => {
  return Game.create({ endTime: end });
};

export const getLastGame = async (completed: boolean) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const lastGame = await Game.findOne(
      completed
        ? { endTime: { $lt: currentTime } }
        : { endTime: { $gte: currentTime } }
    ).sort({ endTime: -1 });

    if (lastGame) {
      return lastGame;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving last game:", error);
  }
};
