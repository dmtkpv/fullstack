import { reactive, computed } from 'vue'

export default function ({ state }) {

    const jobs = {
        1: 1,
        2: 5,
        3: Number.MAX_VALUE
    }

    const id = computed(() => {
        return state.user.plan;
    })

    function hasLocations (total) {
        return id.value || total < 1;
    }

    function hasJobs (total) {
        return total < jobs[id.value];
    }

    return reactive({
        id,
        hasLocations,
        hasJobs
    })

}