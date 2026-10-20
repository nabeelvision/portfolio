import { ProjectItem, ProfileInfo } from '../types';
import initialProjects from '../data/projects.json';
import initialProfile from '../data/profile.json';

const STORAGE_KEY = 'nabeel_portfolio_projects_v1';
const PROFILE_KEY = 'nabeel_portfolio_profile_v1';
const AUTH_KEY = 'admin_token';

export const projectService = {
  getAuthPassword(): string {
    return sessionStorage.getItem(AUTH_KEY) || '';
  },

  setAuthPassword(password: string) {
    sessionStorage.setItem(AUTH_KEY, password);
  },

  clearAuth() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem('admin_authenticated');
  },

  async verifyPassword(password: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        this.setAuthPassword(password);
        sessionStorage.setItem('admin_authenticated', 'true');
        return true;
      }
    } catch {
      // Offline fallback
      if (password === 'BsAi0035%') {
        this.setAuthPassword(password);
        sessionStorage.setItem('admin_authenticated', 'true');
        return true;
      }
    }
    return false;
  },

  // Fetch projects from server (with localStorage/bundled fallback)
  async fetchProjects(): Promise<ProjectItem[]> {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.projects));
          return data.projects;
        }
      }
    } catch (err) {
      console.warn('API unreachable, falling back to local cache/data:', err);
    }

    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return initialProjects as ProjectItem[];
  },

  // Upload preview image file
  async uploadPreviewImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-password': this.getAuthPassword() || 'BsAi0035%',
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.imageUrl) {
          return data.imageUrl;
        }
      }
    } catch (err) {
      console.error('Image upload failed, falling back to base64 data URL:', err);
    }

    // Fallback: convert to base64 Data URL so image is always preserved
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },

  // Add new project (saves to server file and updates local storage)
  async addProject(project: Partial<ProjectItem>): Promise<{ success: boolean; project?: ProjectItem; message?: string }> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': this.getAuthPassword() || 'BsAi0035%',
        },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.project) {
          const current = await this.fetchProjects();
          const exists = current.some((p) => p.id === data.project.id);
          const updated = exists ? current : [data.project, ...current];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return { success: true, project: data.project, message: data.message };
        }
      }
    } catch (err) {
      console.warn('Server error on add, saving to local storage fallback:', err);
    }

    // Client-side fallback if server write fails
    const newId = project.id || (project.title ? project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now() : 'proj-' + Date.now());
    const fallbackProject: ProjectItem = {
      id: newId,
      title: project.title || 'Untitled Project',
      category: project.category || 'Web Application',
      description: project.description || '',
      icon: project.icon || '🚀',
      themeClass: project.themeClass || 'p1',
      link: project.link || '#',
      previewImage: project.previewImage || '',
      imageUrl: project.imageUrl || project.previewImage || '',
      createdAt: new Date().toISOString(),
      caseStudy: project.caseStudy || {
        overview: project.description || '',
        highlights: ['Built and launched with modern web standards'],
        techStack: ['React', 'TypeScript', 'Node.js'],
        liveUrl: project.link || '#',
        githubUrl: 'https://github.com/nabeelvision',
      },
    };

    const current = await this.fetchProjects();
    const updated = [fallbackProject, ...current.filter((p) => p.id !== fallbackProject.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return {
      success: true,
      project: fallbackProject,
      message: 'Project saved locally in browser!',
    };
  },

  // Update existing project
  async updateProject(id: string, updates: Partial<ProjectItem>): Promise<boolean> {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': this.getAuthPassword() || 'BsAi0035%',
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const current = await this.fetchProjects();
        const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
      }
    } catch (err) {
      console.warn('Server error updating project, updating local fallback:', err);
    }

    const current = await this.fetchProjects();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': this.getAuthPassword() || 'BsAi0035%',
        },
      });
      if (res.ok) {
        const current = await this.fetchProjects();
        const updated = current.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
      }
    } catch (err) {
      console.warn('Server error on delete, updating local fallback:', err);
    }

    const current = await this.fetchProjects();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  // Fetch profile information
  async fetchProfile(): Promise<ProfileInfo> {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
          return data.profile;
        }
      }
    } catch (err) {
      console.warn('Profile API unreachable, using local cache:', err);
    }

    const local = localStorage.getItem(PROFILE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return initialProfile as ProfileInfo;
  },

  // Update profile photo with zoom and position
  async updateProfilePhoto(
    profileImage: string,
    zoom = 1,
    position = 'center 10%'
  ): Promise<{ success: boolean; profile?: ProfileInfo; message?: string }> {
    try {
      const res = await fetch('/api/profile/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': this.getAuthPassword() || 'BsAi0035%',
        },
        body: JSON.stringify({
          profileImage,
          profileImageZoom: zoom,
          profileImagePosition: position,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
          return { success: true, profile: data.profile, message: data.message };
        }
      }
    } catch (err) {
      console.warn('Server error on profile photo update, saving local fallback:', err);
    }

    // Fallback locally
    const current = await this.fetchProfile();
    const updated: ProfileInfo = {
      ...current,
      profileImage,
      profileImageZoom: zoom,
      profileImagePosition: position,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return { success: true, profile: updated, message: 'Profile photo updated successfully!' };
  },
};
