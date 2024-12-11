import { useLists, getListItem } from '#app/services/utils.js'

export default function googleJob ({ company, location, ...job }) {

    const lists = useLists();



    // -------------------
    // Common
    // -------------------

    const schema = {
        '@context' : 'https://schema.org/',
        '@type' : 'JobPosting',
        'title': job.title,
        'description' : job.content,
        'datePosted': new Date(job.updated_at).toISOString().split('T')[0],
        'hiringOrganization': {
            '@type': 'Organization',
            'name': company.name,
        },
        'jobLocation': {
            '@type': 'Place',
            'address': {
                '@type': 'PostalAddress',
                'addressCountry': location.country
            }
        }
    }



    // -------------------
    // Common
    // -------------------

    const date = new Date(job.updated_at);
    date.setFullYear(date.getFullYear() + 1);
    schema.validThrough = date.toISOString();
    schema.employmentType = 'INTERN';



    // -------------------
    // hiringOrganization
    // -------------------

    schema.hiringOrganization.logo = job.image ? `${ADMIN_URL}/assets/${job.image}?width=512` : `${APP_URL}/google-job.png`

    if (company.website) {
        schema.hiringOrganization.sameAs = company.website
    }



    // -------------------
    // jobLocation
    // -------------------

    if (location.route) {
        schema.jobLocation.address.streetAddress = location.street_number ? location.street_number + ' ' + location.route : location.route;
    }
    if (location.locality) {
        schema.jobLocation.address.addressLocality = location.locality;
    }
    if (location.region) {
        schema.jobLocation.address.addressRegion = location.region;
    }
    if (location.postcode) {
        schema.jobLocation.address.postalCode = location.postcode;
    }



    // -------------------
    // baseSalary
    // -------------------

    if (job.salary_frequency && (job.salary_min || job.salary_max)) {

        const { data } = getListItem(lists.salary_frequencies, job.salary_frequency);

        schema.baseSalary = {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: {
                '@type': 'QuantitativeValue',
                unitText: data
            }
        }

        if (job.salary_min && job.salary_max) {
            schema.baseSalary.value.minValue = job.salary_min;
            schema.baseSalary.value.maxValue = job.salary_max;
        }
        else {
            schema.baseSalary.value.value = job.salary_min || job.salary_max;
        }

    }



    // ----------------------
    // experienceRequirements
    // ----------------------

    if (job.experience) {
        schema.experienceRequirements = {
            '@type' : 'OccupationalExperienceRequirements',
            'monthsOfExperience': job.experience * 12
        }
    }



    // ----------------------
    // educationRequirements
    // ----------------------

    if (job.education_levels.length) {

        const values = job.education_levels.map(value => {
            return getListItem(lists.education_levels, value)?.data;
        });

        schema.educationRequirements = [...new Set(values)].map(value => ({
            '@type': "EducationalOccupationalCredential",
            'credentialCategory': value
        }))

    }



    // -------------------
    // Exports
    // -------------------

    return schema;



}