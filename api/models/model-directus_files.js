import { FOLDERS } from '@vacature/shared/constants.js'



// -----------------
// Relations
// -----------------

const relations = {

    applications () {
        return this.leftJoin('applications', 'applications.cv', 'directus_files.id')
    },

    jobs_images (method = 'inner') {
        return this[method + 'Join']('jobs_images', 'jobs_images.image', 'directus_files.id')
    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived = false, folder, job } = {}) {

    if (my) {
        const { user } = this.userParams;
        this.where('directus_files.uploaded_by', user)
    }

    if (archived !== undefined) {
        this.where('directus_files.archived', archived)
    }

    if (folder) {
        this.where('directus_files.folder', FOLDERS[folder])
    }

    if (job !== undefined) {
        if (job) {
            this.relation('directus_files', 'jobs_images');
            this.where('jobs_images.job', job)
        }
        else {
            this.relation('directus_files', 'jobs_images', 'left');
            this.where('jobs_images.job', null)
            this.where('directus_files.folder', FOLDERS.jobs);
        }
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    queries: { filter }
}