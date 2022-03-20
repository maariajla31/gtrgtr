//import { UserProfileInterface } from "@/store/Profile/ProfileInterfaces";
import { storage } from "../firebase";

async function doGetImage(path: string, defaultImage?: string) {
  const fallbackImg = "img/gtr-images/gtr-no-image.png";
  const defaultImg = defaultImage || fallbackImg;
  const pathRef = storage.ref(path);

  const response = pathRef
    .getDownloadURL()
    .then((url) => {
      return url;
    })
    .catch(() => {
      return storage
        .ref(defaultImg)
        .getDownloadURL()
        .then((url) => {
          return url;
        })
        .catch(() => {
          return storage
            .ref(fallbackImg)
            .getDownloadURL()
            .then((url) => {
              return url;
            });
        });
    });
  return await response;
}

async function doUpdateImage(
  path: string,
  dataBase64Url: string
): Promise<boolean> {
  const pathRef = storage.ref(path);

  const response = pathRef
    .putString(dataBase64Url, "data_url")
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });
  return await response;
}

async function doDeleteImage(pictureURL: string) {
  const toDeleteRef = storage.refFromURL(pictureURL);

  if (!toDeleteRef.fullPath.startsWith("img/gtr-images/")) {
    const response = toDeleteRef
      .delete()
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    return await response;
  } else {
    return true;
  }
}

export const images = {
  methods: {
    getImage(path: string, defaultImage?: string): Promise<string> {
      return doGetImage(path, defaultImage);
    },
    getProfilePicture(path: string): Promise<string> {
      const defaultImage = "img/gtr-images/neon/blue/gtr-logo.jpg";
      return doGetImage(path, defaultImage);
    },
    setImage(request: any): Promise<boolean> {
      return doUpdateImage(request.pictureUrl, request.dataBase64Url);
    },
    removeImage(pictureURL: string): Promise<boolean> {
      return doDeleteImage(pictureURL);
    }
  }
};
