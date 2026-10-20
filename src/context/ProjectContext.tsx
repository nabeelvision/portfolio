import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectItem, ProfileInfo } from '../types';
import { projectService } from '../services/projectService';
import initialProjects from '../data/projects.json';
import initialProfile from '../data/profile.json';

interface ProjectContextType {
  projects: ProjectItem[];
  profile: ProfileInfo;
  loading: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  addProject: (data: Partial<ProjectItem>, imageFile?: File | null) => Promise<{ success: boolean; message?: string }>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  updateProfilePhoto: (
    photoUrlOrBase64: string,
    zoom?: number,
    position?: string,
    imageFile?: File | null
  ) => Promise<{ success: boolean; message?: string }>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects as ProjectItem[]);
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile as ProfileInfo);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const refreshData = async () => {
    try {
      const [fetchedProjects, fetchedProfile] = await Promise.all([
        projectService.fetchProjects(),
        projectService.fetchProfile(),
      ]);

      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
      if (fetchedProfile && fetchedProfile.name) {
        setProfile(fetchedProfile);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Check if URL has #admin hash to auto-open admin portal
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const addProject = async (data: Partial<ProjectItem>, imageFile?: File | null) => {
    try {
      let previewImageUrl = data.previewImage || '';

      if (imageFile) {
        previewImageUrl = await projectService.uploadPreviewImage(imageFile);
      }

      const result = await projectService.addProject({
        ...data,
        previewImage: previewImageUrl,
        imageUrl: previewImageUrl,
      });

      if (result.success && result.project) {
        setProjects((prev) => [result.project!, ...prev.filter((p) => p.id !== result.project!.id)]);
        return { success: true, message: result.message || 'Project added and code updated!' };
      }
      return { success: false, message: result.message || 'Failed to add project' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error creating project' };
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>) => {
    const success = await projectService.updateProject(id, updates);
    if (success) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }
    return success;
  };

  const deleteProject = async (id: string) => {
    const success = await projectService.deleteProject(id);
    if (success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    return success;
  };

  const updateProfilePhoto = async (
    photoUrlOrBase64: string,
    zoom = 1,
    position = 'center 10%',
    imageFile?: File | null
  ) => {
    try {
      let finalPhoto = photoUrlOrBase64;
      if (imageFile) {
        finalPhoto = await projectService.uploadPreviewImage(imageFile);
      }

      const res = await projectService.updateProfilePhoto(finalPhoto, zoom, position);
      if (res.success && res.profile) {
        setProfile(res.profile);
        return { success: true, message: 'Profile photo updated and saved to code!' };
      }
      return { success: false, message: res.message || 'Failed to update photo' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating profile photo' };
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        profile,
        loading,
        isAdminOpen,
        setIsAdminOpen,
        addProject,
        updateProject,
        deleteProject,
        updateProfilePhoto,
        refreshProjects: refreshData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
