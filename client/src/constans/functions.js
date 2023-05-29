import { BACKGROUND_IMAGES } from "./images";

export const getRandomImage = () => {
    return BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
  }