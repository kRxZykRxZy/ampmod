/*!
 * Project Sync Module
 * 
 * Handles AmpMod project creation, saving, sharing, and session logic.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Fetch the current session (username, etc.)
 * Requires valid cookie credentials.
 */
export async function getSession() {
    const res = await fetch("https://ampmod.vercel.app/internalapi/session", {
        credentials: "include"
    });

    if (!res.ok) return null;

    try {
        return await res.json();
    } catch {
        return null;
    }
}

/**
 * Fetch metadata for a specific project by ID.
 */
export async function getProjectMeta(projectId) {
    const res = await fetch(`https://ampmod.vercel.app/internalapi/projects/${projectId}`, {
        credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch project metadata");
    return await res.json();
}

/**
 * Create a new project if user is authenticated.
 */
export async function createNewProject(vm) {
    const body = vm.toJSON();
    const res = await fetch(
        "https://ampmod.vercel.app/internalapi/create/projects?title=Untitled%20Project",
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body
        }
    );

    if (!res.ok) throw new Error(`Project creation failed (${res.status})`);
    const json = await res.json();
    return json.project.id;
}

/**
 * Save updates to an existing project.
 */
export async function saveProject(vm, projectId, title) {
    const body = vm.toJSON();
    const res = await fetch(
        `https://ampmod.vercel.app/internalapi/projects/update?pID=${projectId}&title=${encodeURIComponent(
            title || "Untitled Project"
        )}`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body
        }
    );

    if (!res.ok) throw new Error("Save failed");
    return await res.json();
}

/**
 * Share a project (no body required).
 */
export async function shareProject(projectId) {
    const res = await fetch(
        `https://ampmod.vercel.app/internalapi/projects/${projectId}/share`,
        {
            method: "POST",
            credentials: "include"
        }
    );

    if (!res.ok) throw new Error("Share failed");
    return await res.json();
}
