import { firebase } from "../firebase/firebase";

export const getDownloadableLink = async ({ pathname, imageUri }) => {
    const response = await fetch(imageUri)
    const blob = await response.blob();
    const fileName = imageUri.substring(imageUri?.lastIndexOf("/") + 1)
    var ref = firebase.storage().ref().child(`${pathname}/` + fileName);
    var snapshot = await ref.put(blob);
    var downloadURL = await snapshot.ref.getDownloadURL()
    return downloadURL
}   