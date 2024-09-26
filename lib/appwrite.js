import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.aora",
    projectId: "6630930500362e934f3c",
    databaseId: "66309407000d347f24d5",
    userCollectionId: '6630941d00178e09099b',
    vidoeCollectionId: '6630943b00029cd548e0',
    storageId: "66309555000f0b7cbfc3"
}

const { endpoint, platform, projectId, databaseId, userCollectionId, vidoeCollectionId, storageId } = appwriteConfig

const client = new Client();
const account = new Account(client);
const avatars = new Avatars()
const databases = new Databases()
const storage = new Storage()

client.setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform);

export const createUser = async ({ email, password, username }) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username)

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = new databases.createDocument(databaseId, userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                password: password,
                avatar: avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error

        const currentUser = await databases.listDocuments(databaseId, userCollectionId, [Query.equal('accountId', currentAccount.$id)]);

        if (!currentUser) throw Error;

        return currentAccount.documents[0];
    } catch (error) {
        throw new Error(error)
    }
}

export const getAllpost = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, vidoeCollectionId)
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPost = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, vidoeCollectionId, Query.orderDesc('$createdAt'))
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPost = async (query) => {
    try {
        const posts = await databases.listDocuments(databaseId, vidoeCollectionId, Query.search('title', query))
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPost = async (userId) => {
    try {
        const posts = await databases.listDocuments(databaseId, vidoeCollectionId, Query.equal('creator', userId))
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {

    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        }
        else {
            throw new Error("Inavlid file Type")
        }

        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }

}

export const uploadFile = async (file, type) => {
    if (!file) return

    const asset = {
        name: file.name,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile?.$id, type)

        return fileUrl

    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newpost = await databases.createDocument(databaseId, vidoeCollectionId, ID.unique(), {
            title: form?.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form?.prompt,
            creator: form?.userId
        })

        return newpost

    } catch (error) {
        throw new Error(error)
    }
}