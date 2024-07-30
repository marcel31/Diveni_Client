import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, deleteUser } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { use } from "i18next";

const firebaseConfig = {
  apiKey: "AIzaSyAR3zhbelx7stTajKGZhBaDvBq289QcAv8",
  authDomain: "diveni-e73be.firebaseapp.com",
  databaseURL:
    "https://diveni-e73be-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "diveni-e73be",
  storageBucket: "diveni-e73be.appspot.com",
  messagingSenderId: "468420706356",
  appId: "1:468420706356:web:030182b3a43d8ed70d8a61",
  measurementId: "G-SVYJH1V6R5",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
export { provider };

const auth = getAuth(app);
auth.useDeviceLanguage();
auth.setPersistence(browserLocalPersistence);
const db = getFirestore(app);
export const firestore = getFirestore();

export const createUserDocument = async (user, additionalData) => {
  if (!user) return;

  const db = getFirestore();
  const usersCollection = collection(db, "users");

  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    const { email } = user;
    const {
      displayName,
      crowns,
      friendsRequest,
      friends,
      photoURL,
      level,
      experience,
      role,
    } = additionalData;

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        crowns: crowns || 0,
        friendsRequest: friendsRequest || {},
        friends: friends || {},
        level: level || 1,
        photoURL: photoURL || null,
        experience: experience || 0,
        role: role || "user",
        createdAt: new Date(),
      });

    } catch (error) {
      console.log("Error in creating user", error);
    }
  }
};

export const getUserProfile = async (uid) => {
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersCollection, where("uid", "==", uid))
  );
  const userProfile = querySnapshot.docs[0].data();
  return userProfile;
};


export const getAllUsers = async () => {
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(usersCollection);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};

export const countNumberOfFriendRequestsFromUser = async (user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs[0].data();
  const friendsRequests = userData.friendsRequest
    ? Object.keys(userData.friendsRequest)
    : [];
  return friendsRequests.length;
}

export const sendEmailAndDoubtFromUserToAdmin = async (user, email, doubt) => {
  try {
    const usersCollection = collection(db, "users");
    // Find all users that have the admin role
    const q = query(usersCollection, where("role", "==", "admin"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const adminData = doc.data();
      const doubts = adminData.doubts || {};
      doubts[email] = doubt;
      await updateDoc(doc.ref, { doubts });
    });

    console.log("Email and doubt sent successfully to all admin users.");
  } catch (error) {
    console.error("Error sending email and doubt to admin users:", error);
  }
}

export const subscribeToFriendRequestsCount = (user, setNumberFR) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        const userData = change.doc.data();
        const friendsRequests = userData.friendsRequest ? Object.keys(userData.friendsRequest) : [];
        const friendRequestsCount = friendsRequests.length;
        setNumberFR(friendRequestsCount);
      }
    });
  });

  return unsubscribe;
};

export const subscribeToFriendRequests = (user, setFriendRequests) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        const userData = change.doc.data();
        const friendsRequests = userData.friendsRequest ? Object.keys(userData.friendsRequest).map((friend) => userData.friendsRequest[friend]) : [];
        setFriendRequests(friendsRequests);
      }
    });
  });

  return unsubscribe;
};

export const isUserFriendRequestSent = async (loggedUser, user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs[0].data();
  const friendsRequests = userData.friendsRequest
    ? Object.keys(userData.friendsRequest)
    : [];
  return friendsRequests.includes(loggedUser.uid);
};

export const isUserFriend = async (loggedUser, user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const userData = querySnapshot.docs[0].data();
  const friends = userData.friends ? Object.keys(userData.friends) : [];
  return friends.includes(loggedUser.uid);
};

export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("Usuario desconectado");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};


export const deleteUserNormal = async (user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef);
    await auth.currentUser.delete();
    console.log("Usuario eliminado con éxito.");
  } else {
    console.log("Documento de usuario no encontrado.");
  }
};

export const deleteUserFromAdmin = async (user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    try {
      await deleteDoc(docRef);

    } catch (error) {
      console.log("Error deleting user from Firebase Auth.", error);
    }

    console.log("Usuario eliminado con éxito.");
  } else {
    console.log("Documento de usuario no encontrado.");
  }
};

export const getUsersThatAreFriends = async (user) => {
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(usersCollection);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const friends = user.friends
    ? Object.keys(user.friends).map((friend) => user.friends[friend])
    : [];
  const friendsData = friends.map((friend) =>
    users.find((user) => user.uid === friend.uid)
  );
  return friendsData;
};

export const getUsersFromFriendsRequests = async (user) => {
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(usersCollection);
  const users = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const friendsRequests = user.friendsRequest
    ? Object.keys(user.friendsRequest).map(
      (friend) => user.friendsRequest[friend]
    )
    : [];
  const friendsRequestsData = friendsRequests.map((friend) =>
    users.find((user) => user.uid === friend.uid)
  );
  return friendsRequestsData;
};

export const isUserAdmin = async (user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    return userData.role === "admin";
  }
  return false;
};

export const sendFriendRequest = async (loggedUser, user) => {
  const usersCollection = collection(db, "users");

  // Query for user
  const querySnapshot = await getDocs(
    query(usersCollection, where("uid", "==", user.uid))
  );
  const userDocRef = querySnapshot.docs[0].ref;

  // Query for loggedUser
  const qLoggedUser = query(
    usersCollection,
    where("uid", "==", loggedUser.uid)
  );
  const querySnapshotLoggedUser = await getDocs(qLoggedUser);
  const loggedUserDocRef = querySnapshotLoggedUser.docs[0].ref;

  // Update userFriendsRequest map with information from loggedUser
  const userFriendsRequest = querySnapshot.docs[0].data().friendsRequest;
  userFriendsRequest[loggedUser.uid] = {
    displayName: loggedUser.displayName,
    photoURL: loggedUser.photoURL,
    crowns: loggedUser.crowns,
    experience: loggedUser.experience,
    level: loggedUser.level,
    uid: loggedUser.uid,
  };

  try {
    // Update the user document with the modified userFriendsRequest map
    await updateDoc(userDocRef, { friendsRequest: userFriendsRequest });
  } catch (error) {
    console.log("Error sending friend request: ", error);
  }
};

export const acceptFriendRequest = async (loggedUser, friendUid) => {
  const usersCollection = collection(db, "users");

  try {
    // Query for logged user
    const loggedUserSnapshot = await getDocs(
      query(usersCollection, where("uid", "==", loggedUser.uid))
    );
    const loggedUserDocRef = loggedUserSnapshot.docs[0].ref;
    const loggedUserData = loggedUserSnapshot.docs[0].data();

    // Update logged user's friend list with friend's info
    const updatedLoggedUserFriends = {
      ...loggedUserData.friends,
      [friendUid]: loggedUserData.friendsRequest[friendUid],
    };

    // Remove friend request from logged user's friend requests
    const updatedLoggedUserFriendsRequest = {
      ...loggedUserData.friendsRequest,
    };
    delete updatedLoggedUserFriendsRequest[friendUid];

    // Update logged user document in Firestore with updated friend list and friend requests
    await updateDoc(loggedUserDocRef, {
      friends: updatedLoggedUserFriends,
      friendsRequest: updatedLoggedUserFriendsRequest,
    });

    // Query for friend user
    const friendUserSnapshot = await getDocs(
      query(usersCollection, where("uid", "==", friendUid))
    );
    const friendUserDocRef = friendUserSnapshot.docs[0].ref;
    const friendUserData = friendUserSnapshot.docs[0].data();

    // Update friend user's friend list with logged user's info
    const updatedFriendUserFriends = {
      ...friendUserData.friends,
      [loggedUser.uid]: {
        displayName: loggedUser.displayName,
        photoURL: loggedUser.photoURL,
        crowns: loggedUser.crowns,
        experience: loggedUser.experience,
        level: loggedUser.level,
        uid: loggedUser.uid,
      },
    };

    // Update friend user document in Firestore
    await updateDoc(friendUserDocRef, {
      friends: updatedFriendUserFriends,
    });

    console.log("Friend request accepted successfully.");
  } catch (error) {
    console.log("Error accepting friend request: ", error);
  }
};

export const declineFriendRequest = async (loggedUser, friendUid) => {
  const usersCollection = collection(db, "users");

  try {
    // Query for user
    const querySnapshot = await getDocs(
      query(usersCollection, where("uid", "==", loggedUser.uid))
    );
    const userDocRef = querySnapshot.docs[0].ref;

    // Obtener datos del usuario actual
    const userData = querySnapshot.docs[0].data();

    // Eliminar la solicitud de amistad en friendsRequest
    const updatedFriendsRequest = { ...userData.friendsRequest };
    delete updatedFriendsRequest[friendUid];

    // Actualizar friendsRequest en Firebase
    await updateDoc(userDocRef, { friendsRequest: updatedFriendsRequest });

    console.log("Friend request declined successfully.");
  } catch (error) {
    console.log("Error declining friend request: ", error);
  }
};

export const editNameProfile = async (user, newName) => {
  const usersCollection = collection(db, "users");

  try {
    // Query for user
    const q = query(usersCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs[0].ref;

    // Update the user document with the new name
    await updateDoc(userDocRef, { displayName: newName });

    console.log("User name updated successfully.");

    // Update name in friend documents
    const userData = querySnapshot.docs[0].data();
    const friends = userData.friends ? Object.keys(userData.friends) : [];

    for (let i = 0; i < friends.length; i++) {
      const friendUid = friends[i];
      const qFriend = query(usersCollection, where("uid", "==", friendUid));
      const querySnapshotFriend = await getDocs(qFriend);
      const friendDocRef = querySnapshotFriend.docs[0].ref;

      // Get current friend data
      const friendData = querySnapshotFriend.docs[0].data();

      // Update friend's profile with new name without deleting other fields
      const updatedFriend = {
        ...friendData,
        friends: {
          ...friendData.friends,
          [user.uid]: {
            ...friendData.friends[user.uid], // Retain existing fields under user's id in friend's friends object
            displayName: newName, // Update displayName
          },
        },
      };

      await updateDoc(friendDocRef, updatedFriend);
    }
  } catch (error) {
    console.log("Error updating user name: ", error);
  }
};

export const subscribeToUserProfile = (uid, callback) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", uid));

  return onSnapshot(
    q,
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userProfile = doc.data();
        callback(userProfile);
      });
    },
    (error) => {
      console.error("Error fetching user profile:", error);
    }
  );
};

export const subscribeToAllUsers = (callback) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection);

  return onSnapshot(
    q,
    (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(users);
    },
    (error) => {
      console.error("Error fetching all users:", error);
    }
  );
};

export const subscribeToFriendsUsers = (user, callback) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));

  return onSnapshot(
    q,
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const userProfile = doc.data();
        const friends = userProfile.friends
          ? Object.keys(userProfile.friends).map(
            (friend) => userProfile.friends[friend]
          )
          : [];
        callback(friends);
      });
    },
    (error) => {
      console.error("Error fetching friends users:", error);
    }
  );
};

export const editPhotoProfile = async (user, newPhotoURL) => {
  const usersCollection = collection(db, "users");

  try {
    // Convert image to base64
    const response = await fetch(newPhotoURL);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = async () => {
      const base64DataUrl = reader.result;

      // Update user document with new photo URL
      const q = query(usersCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, { photoURL: base64DataUrl });

      console.log("User photo updated successfully.");

      // Update photo URL in friend documents
      const userData = querySnapshot.docs[0].data();
      const friends = userData.friends ? Object.keys(userData.friends) : [];

      for (let i = 0; i < friends.length; i++) {
        const friendUid = friends[i];
        const qFriend = query(usersCollection, where("uid", "==", friendUid));
        const querySnapshotFriend = await getDocs(qFriend);
        const friendDocRef = querySnapshotFriend.docs[0].ref;

        // Get current friend data
        const friendData = querySnapshotFriend.docs[0].data();

        // Update friend's profile with new photo URL without deleting other fields
        const updatedFriend = {
          ...friendData,
          friends: {
            ...friendData.friends,
            [user.uid]: {
              ...friendData.friends[user.uid], // Retain existing fields under user's id in friend's friends object
              photoURL: base64DataUrl, // Update photoURL
            },
          },
        };

        await updateDoc(friendDocRef, updatedFriend);
      }
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.log("Error updating user photo: ", error);
  }
};

export const deleteUserBack = async (user) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef);
    console.log("User deleted successfully.");
  } else {
    console.log("User document not found.");
  }
};

export const updateExperience = async (user, newExperience) => {
  const usersCollection = collection(db, "users");

  try {
    // Consulta para obtener al usuario
    const q = query(usersCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs[0].ref;

    // Actualiza el documento del usuario con la nueva experiencia
    await updateDoc(userDocRef, { experience: newExperience });

    console.log("Experiencia del usuario actualizada con éxito.");

    // Actualiza la experiencia en los documentos de amigos
    const userData = querySnapshot.docs[0].data();
    const friends = userData.friends ? Object.keys(userData.friends) : [];

    for (let i = 0; i < friends.length; i++) {
      const friendUid = friends[i];
      const qFriend = query(usersCollection, where("uid", "==", friendUid));
      const querySnapshotFriend = await getDocs(qFriend);
      const friendDocRef = querySnapshotFriend.docs[0].ref;

      // Obtiene los datos actuales del amigo
      const friendData = querySnapshotFriend.docs[0].data();

      // Actualiza la experiencia del amigo sin eliminar otros campos
      const updatedFriend = {
        ...friendData,
        friends: {
          ...friendData.friends,
          [user.uid]: {
            ...friendData.friends[user.uid], // Conserva los campos existentes bajo el id del usuario en el objeto friends del amigo
            experience: newExperience, // Actualiza la experiencia
          },
        },
      };

      await updateDoc(friendDocRef, updatedFriend);
    }
  } catch (error) {
    console.log("Error al actualizar la experiencia del usuario: ", error);
  }
};

export const updateLevel = async (user, newLevel) => {
  const usersCollection = collection(db, "users");

  try {
    // Consulta para obtener al usuario
    const q = query(usersCollection, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const userDocRef = querySnapshot.docs[0].ref;

    // Actualiza el documento del usuario actual con el nuevo nivel
    await updateDoc(userDocRef, { level: newLevel });

    console.log("Nivel del usuario actualizado con éxito.");

    // Actualiza el nivel en los documentos de amigos
    const userData = querySnapshot.docs[0].data();
    const friends = userData.friends ? Object.keys(userData.friends) : [];

    // Array para almacenar todas las promesas de actualización de amigos
    const updatePromises = [];

    for (let i = 0; i < friends.length; i++) {
      const friendUid = friends[i];
      const qFriend = query(usersCollection, where("uid", "==", friendUid));
      const querySnapshotFriend = await getDocs(qFriend);
      const friendDocRef = querySnapshotFriend.docs[0].ref;

      // Obtiene los datos actuales del amigo
      const friendData = querySnapshotFriend.docs[0].data();

      // Actualiza el nivel del usuario actual dentro de la subestructura "friends" del amigo
      const updatedFriend = {
        ...friendData,
        friends: {
          ...friendData.friends,
          [user.uid]: {
            ...friendData.friends[user.uid], // Conserva los campos existentes bajo el id del usuario en el objeto friends del amigo
            level: newLevel, // Actualiza el nivel del usuario actual en los documentos de amigos
          },
        },
      };

      // Almacena la promesa de actualización en el array
      updatePromises.push(updateDoc(friendDocRef, updatedFriend));
    }

    // Espera a que todas las promesas de actualización de amigos se completen
    await Promise.all(updatePromises);

    console.log("Niveles de amigos actualizados con éxito.");
  } catch (error) {
    console.log("Error al actualizar el nivel del usuario: ", error);
  }
};

export const deleteFriend = async (user, friendUid) => {
  const usersCollection = collection(db, "users");

  try {
    // Consulta para obtener al usuario
    const userQuery = query(usersCollection, where("uid", "==", user.uid));
    const userSnapshot = await getDocs(userQuery);
    const userDocRef = userSnapshot.docs[0].ref;

    // Obtiene los datos actuales del usuario
    const userData = userSnapshot.docs[0].data();

    // Elimina al amigo de la lista de amigos del usuario
    const updatedUserFriends = { ...userData.friends };
    delete updatedUserFriends[friendUid];

    // Actualiza el documento del usuario con la lista de amigos actualizada
    await updateDoc(userDocRef, { friends: updatedUserFriends });

    // Consulta para obtener al amigo
    const friendQuery = query(usersCollection, where("uid", "==", friendUid));
    const friendSnapshot = await getDocs(friendQuery);
    const friendDocRef = friendSnapshot.docs[0].ref;

    // Obtiene los datos actuales del amigo
    const friendData = friendSnapshot.docs[0].data();

    // Elimina al usuario de la lista de amigos del amigo
    const updatedFriendFriends = { ...friendData.friends };
    delete updatedFriendFriends[user.uid];

    // Actualiza el documento del amigo con la lista de amigos actualizada
    await updateDoc(friendDocRef, { friends: updatedFriendFriends });

    console.log("Amigo eliminado con éxito.");
  } catch (error) {
    console.log("Error al eliminar al amigo: ", error);
  }
};

export { auth, db };