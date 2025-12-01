
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, GeneratedImage, WebsiteProject, LearningProgress } from '../types';
import * as dbService from '../services/dbService';
import { auth } from '../services/firebaseConfig';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { useDrive } from '../hooks/useDrive';

const getFirebaseAuthErrorMessage = (error) => {
  if (error.code) {
      switch (error.code) {
          case 'auth/user-not-found' 'auth/wrong-password' 'auth/invalid-credential' 'Invalid email or password.';
          case 'auth/invalid-email' 'Please enter a valid email address.';
          case 'auth/popup-closed-by-user' 'Sign-in process was cancelled.';
          case 'auth/account-exists-with-different-credential' 'An account already exists with the same email address but different sign-in credentials.';
          default 'An unexpected error occurred. Please try again.';
      }
  }
  return error.message || 'An unexpected error occurred.';
};

const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid data URL");
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type});
}

export ;
  authError | null;
  login: (credentials: { email; password? }) => Promise;
  logout: () => Promise;
  signup: (credentials: { fullName; email; password? }) => Promise;
  addImages: (images<GeneratedImage, 'id' | 'createdAt' | 'isFavorite' | 'userId'>[]) => Promise<GeneratedImage[]>;
  toggleFavorite: (id) => Promise;
  clearAuthError: () => void;
  saveWebsiteProject: (project<WebsiteProject, 'id' | 'createdAt' | 'userId'>) => Promise;
  updateWebsiteProject: (project) => Promise;
  deleteWebsiteProject: (id) => Promise;
  updateCourseProgress: (courseId, completedLessons) => Promise;
  updateUserPreferences: (prefs<User['preferences']>) => Promise;
  updateDeviceModePreference: (mode: 'pc' | 'mobile') => Promise;
  updateUserProfile: (details: { fullName?; profilePictureUrl? }) => Promise;
  changeUserPassword: (currentPassword, newPassword) => Promise;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider.FC<{ children }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [websites, setWebsites] = useState<WebsiteProject[]>([]);
  const [learningProgress, setLearningProgress] = useState<{ [courseId }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const { isDriveReady, driveService } = useDrive();

  const clearAuthError = useCallback(() => setAuthError(null), []);
  
  const syncFromDrive = useCallback(async (userId) => {
    try {
        await driveService.initUserFolders(userId);

        // Fetch and merge websites
        const driveWebsites = await driveService.fetchWebsiteProjects(userId);
        const localWebsites = await dbService.getWebsitesByUserId(userId);
        const mergedWebsites = [...localWebsites];
        driveWebsites.forEach(dw => {
            if (!mergedWebsites.some(lw => lw.id === dw.id)) {
                mergedWebsites.push(dw);
            }
        });
        await dbService.clearWebsitesByUserId(userId);
        await dbService.addMultipleWebsites(mergedWebsites);
        setWebsites(mergedWebsites);

        // Fetch and merge images
        const driveImages = await driveService.fetchGeneratedImages(userId);
        const localImages = await dbService.getImagesByUserId(userId);
        const mergedImages = [...localImages];
        for (const di of driveImages) {
            if (!mergedImages.some(li => li.id === di.id)) {
                mergedImages.push(di);
            }
        }
        await dbService.clearImagesByUserId(userId);
        await dbService.addMultipleImages(mergedImages);
        setImages(mergedImages);

        console.log("📦 Fetched Drive data");
    } catch (error) {
        console.error("Failed to sync from Drive, continuing with local data.", error);
    }
  }, [driveService]);

  const loadUserData = useCallback(async (userId) => {
    const [userImages, userWebsites, userProgress] = await Promise.all([
      dbService.getImagesByUserId(userId),
      dbService.getWebsitesByUserId(userId),
      dbService.getLearningProgressForUser(userId),
    ]);
    setImages(userImages);
    setWebsites(userWebsites);
    const progressMap = userProgress.reduce((acc, p) => {
      acc[p.courseId] = p.completedLessons;
      return acc;
    }, {} as { [courseId });
    setLearningProgress(progressMap);
  }, []);
  
  const handleSuccessfulLogin = useCallback(async (dbUser) => {
    setUser(dbUser);
    await loadUserData(dbUser.id);
  }, [loadUserData]);
  
  useEffect(() => {
    if (user && isDriveReady) {
      syncFromDrive(user.id);
    }
  }, [user, isDriveReady, syncFromDrive]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        let dbUser = await dbService.getUserById(firebaseUser.uid);
        
        if (!dbUser) {
            const userToSave = {
                id.uid,
                fullName.displayName || 'New User',
                email.email!,
            };
            await dbService.putUser(userToSave);
            dbUser = userToSave;
        } else if (dbUser.fullName === 'New User' && firebaseUser.displayName) {
             const userToSave = { ...dbUser, fullName.displayName };
             await dbService.putUser(userToSave);
             dbUser = userToSave;
        }

        await handleSuccessfulLogin(dbUser);

      } else {
        setUser(null);
        setImages([]);
        setWebsites([]);
        setLearningProgress({});
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [handleSuccessfulLogin]);


  const login = async ({ email, password = '' }: { email; password? }) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  
  const signup = async ({ fullName, email, password = '' }: { fullName; email; password? }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      // onAuthStateChanged will handle user creation in DB and subsequent login flow.
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('deviceMode');
  };

  const addImages = useCallback(async (imagesToAdd<GeneratedImage, 'id' | 'createdAt' | 'isFavorite' | 'userId'>[])<GeneratedImage[]> => {
    if (!user) return [];
    const newImages = imagesToAdd.map(img => ({
      ...img,
      id.randomUUID(),
      userId.id,
      createdAt Date().toISOString(),
      isFavorite,
    }));
    await dbService.addMultipleImages(newImages);
    setImages(prev => [...newImages, ...prev]);

    if (isDriveReady) {
        newImages.forEach(image => {
            const blob = dataURLtoBlob(image.imageUrl);
            driveService.uploadFile(user.id, 'images', `${image.id}.jpg`, blob, {
                prompt.prompt,
                negativePrompt.negativePrompt,
                style.style,
                aspectRatio.aspectRatio,
                createdAt.createdAt,
                isFavorite(image.isFavorite),
                id.id,
                userId.userId,
            }).catch(e => console.error("Drive upload failed for image", e));
        });
    }

    return newImages;
  }, [user, isDriveReady, driveService]);

  const toggleFavorite = useCallback(async (id) => {
    const imageToToggle = images.find(img => img.id === id);
    if (imageToToggle && user) {
      const updatedImage = { ...imageToToggle, isFavorite: !imageToToggle.isFavorite };
      await dbService.updateImage(updatedImage);
      setImages(prev => prev.map(img => img.id === id ? updatedImage ));
        if (isDriveReady) {
            const blob = dataURLtoBlob(updatedImage.imageUrl);
             driveService.uploadFile(user.id, 'images', `${updatedImage.id}.jpg`, blob, {
                prompt.prompt,
                negativePrompt.negativePrompt,
                style.style,
                aspectRatio.aspectRatio,
                createdAt.createdAt,
                isFavorite(updatedImage.isFavorite),
                id.id,
                userId.userId,
            }, true).catch(e => console.error("Drive favorite update failed", e));
        }
    }
  }, [images, user, isDriveReady, driveService]);

  const saveWebsiteProject = useCallback(async (projectData<WebsiteProject, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) throw new Error("User not logged in");
    const newProject = {
      ...projectData,
      id.randomUUID(),
      userId.id,
      createdAt Date().toISOString(),
    };
    await dbService.addWebsite(newProject);
    setWebsites(prev => [newProject, ...prev]);
    
    if (isDriveReady) {
        const blob = new Blob([newProject.html], { type: 'text/html' });
        driveService.uploadFile(user.id, 'websites', `${newProject.id}.html`, blob, {
            name.name,
            createdAt.createdAt,
            id.id,
            userId.userId,
        }).catch(e => console.error("Drive website save failed", e));
    }

    return newProject;
  }, [user, isDriveReady, driveService]);

  const updateWebsiteProject = useCallback(async (project) => {
    if (!user || user.id !== project.userId) return;
    await dbService.updateWebsite(project);
    setWebsites(prev => prev.map(p => p.id === project.id ? project ));

    if (isDriveReady) {
        const blob = new Blob([project.html], { type: 'text/html' });
        driveService.uploadFile(user.id, 'websites', `${project.id}.html`, blob, {
            name.name,
            createdAt.createdAt,
            id.id,
            userId.userId,
        }, true).catch(e => console.error("Drive website update failed", e));
    }
  }, [user, isDriveReady, driveService]);

  const deleteWebsiteProject = useCallback(async (id) => {
    const projectToDelete = websites.find(p => p.id === id);
    await dbService.deleteWebsite(id);
    setWebsites(prev => prev.filter(p => p.id !== id));
    if (isDriveReady && user && projectToDelete) {
        driveService.deleteFileByName(user.id, 'websites', `${id}.html`).catch(e => console.error("Drive website delete failed", e));
    }
  }, [user, isDriveReady, driveService, websites]);
  
  const updateCourseProgress = useCallback(async (courseId, completedLessons) => {
      if (!user) return;
      const progress = { userId.id, courseId, completedLessons };
      await dbService.updateLearningProgress(progress);
      setLearningProgress(prev => ({...prev, [courseId]}));
  }, [user]);
  
  const updateUserPreferences = useCallback(async (prefs<User['preferences']>) => {
    if (!user) return;
    const updatedUser = {
        ...user,
        preferences: {
            ...user.preferences,
            ...prefs,
        },
    };
    await dbService.putUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  const updateDeviceModePreference = useCallback(async (mode: 'pc' | 'mobile') => {
    await updateUserPreferences({ deviceMode });
  }, [updateUserPreferences]);

  const updateUserProfile = useCallback(async (details: { fullName?; profilePictureUrl? }) => {
    if (!user || !auth.currentUser) return;
    const updatedUserDetails = {};
    const firebaseProfileUpdate: { displayName? } = {};

    if (details.fullName && details.fullName !== user.fullName) {
        updatedUserDetails.fullName = details.fullName;
        firebaseProfileUpdate.displayName = details.fullName;
    }

    if (typeof details.profilePictureUrl !== 'undefined') {
        updatedUserDetails.profilePictureUrl = details.profilePictureUrl;
    }

    if (Object.keys(firebaseProfileUpdate).length > 0) {
        await updateProfile(auth.currentUser, firebaseProfileUpdate);
    }

    if (Object.keys(updatedUserDetails).length > 0) {
        const updatedUser = { ...user, ...updatedUserDetails };
        await dbService.putUser(updatedUser);
        setUser(updatedUser);
    }
  }, [user]);

  const changeUserPassword = async (currentPassword, newPassword) => {
      if (!auth.currentUser || !auth.currentUser.email) {
          throw new Error("No user is currently signed in.");
      }
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    images,
    websites,
    learningProgress,
    authError,
    login,
    logout,
    signup,
    addImages,
    toggleFavorite,
    clearAuthError,
    saveWebsiteProject,
    updateWebsiteProject,
    deleteWebsiteProject,
    updateCourseProgress,
    updateUserPreferences,
    updateDeviceModePreference,
    updateUserProfile,
    changeUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
