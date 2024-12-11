<!--
    Styles
-->

<style lang="scss">

    .K8MCgQ {



        // -------------------
        // Hero
        // -------------------

        .hero {
            margin-bottom: $gap;
        }



        // -------------------
        // Messages
        // -------------------

        &_messages {

            padding: $gap-lg;
            margin-bottom: $gap;

            .item-message:not(:last-child) {
                margin-bottom: $gap-lg;
            }

        }



        // --------------------
        // Actions
        // --------------------

        &_actions {

            .ui-button {
                @extend %grey;
            }

            ._approve {
                &:disabled, &:hover, &._active {
                    @extend %green;
                }
                &._active:hover {
                    @extend %green-dark;
                }
            }

            ._reject {
                &:disabled, &:hover, &._active {
                    @extend %red;
                }
                &._active:hover {
                    @extend %red-dark;
                }

            }

        }



        // -------------------
        // Form
        // -------------------

        &_form {

            padding: $gap-lg;

            .i-input {
                padding: 12px 12px 12px 16px;
                background: $blue-light;
            }

            .ui-error {
                margin-top: $gap-lg;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <section class="K8MCgQ">


        <!-- job -->

        <article v-if="data.room.job.id" class="tile hero D4VyNq">
            <unit-job class="hero_content" heading="h1" :value="data.room.job" />
            <div class="hero_actions">
                <ui-button text="Show job" :to="{ name: 'job', params: { id: data.room.job.id, slug: data.room.job.slug }}" />
            </div>
        </article>


        <!-- company -->

        <article v-else-if="user.role === 'candidate'" class="tile hero D4VyNq">
            <unit-company class="hero_content" heading="h1" :value="data.room.company" />
            <div class="hero_actions">
                <ui-button text="Company page" :to="{ name: 'company', params: { id: data.room.company.id, slug: data.room.company.slug }}" />
            </div>
        </article>


        <!-- candidate -->

        <article v-else class="tile hero D4VyNq">
            <unit-candidate class="hero_content" heading="h1" :value="data.room.candidate" />
            <div class="hero_actions">
                <ui-button text="Show profile" :to="{ name: 'candidate', params: { id: data.room.candidate.id } }" />
                <ui-button v-if="data.room.candidate.cv" text="Download CV" @click="download(data.room.candidate.cv)" />
            </div>
        </article>


        <!-- messages -->

        <div class="K8MCgQ_messages tile">
            <item-message
                v-for="message in data.messages"
                :key="message.id"
                :value="message"
                :room="data.room">
                <div class="K8MCgQ_actions row" v-if="user.type === 'company'">

                    <ui-button
                        type="approve"
                        :text="status === 'APPROVED' ? 'APPROVED_TAG' : 'BUTTON_APPROVE'"
                        :class="{ _active: status === 'PENDING' }"
                        :disabled="status === 'APPROVED'"
                        @click="setStatus('APPROVED')"
                    />

                    <ui-button
                        type="reject"
                        :text="status === 'REJECTED' ? 'REJECTED_TAG' : 'BUTTON_REJECT'"
                        :class="{ _active: status === 'PENDING' }"
                        :disabled="status === 'REJECTED'"
                        @click="setStatus('REJECTED')"
                    />

                </div>
            </item-message>
        </div>


        <!-- form -->

        <form class="K8MCgQ_form tile" @submit.prevent="submit">

            <i-input v-model="message" :disabled="send.pending" placeholder="Type your message here…">
                <template #after>
                    <ui-button text="Send" :loading="send.pending" submit />
                </template>
            </i-input>

            <ui-error v-if="send.error" :value="send.error" />

        </form>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { TEMPLATES_STATUSES, STATUS_TEMPLATES } from '@vacature/shared/constants.js'
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { usePreload, useText, useUser, useAPI, useMeta, useModal, useIo, download } from '#app/services/utils'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-room',
            'unit-job',
            'm-message'
        ],

        lists: [
            'languages',
            'education_fields',
            'education_levels',
            'job_types',
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const room = qs.integer(to.params.id)

            return {
                room: api('account-rooms-item').fetch(room),
                messages: api('account-messages-list').fetch({ room }),
                count: api('account-messages-count').fetch({ room }),
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-room');
    const send = useAPI('account-messages-create');
    const data = usePreload();
    const user = useUser();
    const modal = useModal();
    const io = useIo();
    const message = ref(null);

    const status = computed(() => {
        return data.room.job.status;
    })

    const room = computed(() => ({
        candidate: data.room.candidate.id,
        company: data.room.company.id,
        job: data.room.job.id,
    }));



    // -------------------
    // Actions
    // -------------------

    function submit () {
        send.quiet({ room, message: message.value });
        message.value = null;
    }

    function setStatus (status) {
        modal.show('message', {
            room,
            title: `Change status to ${status}`,
            button: `Submit ${status}`,
            edits: {
                template: STATUS_TEMPLATES[status]
            }
        })
    }

    function onFocus () {
        const active = document.hasFocus() && !document.hidden;
        const event = active ? 'focus' : 'blur';
        io.emit(event, data.room.id);
    }



    // -------------------
    // Listeners
    // -------------------

    io.on('message', message => {
        if (message.room !== data.room.id) return;
        data.messages.push(message);
        const status = TEMPLATES_STATUSES[message.template];
        if (status) data.room.job.status = status;
    })

    onMounted(() => {
        io.emit('join', data.room.id);
        document.addEventListener('visibilitychange', onFocus);
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onFocus);
    })

    onUnmounted(() => {
        io.emit('leave', data.room.id);
        document.removeEventListener('visibilitychange', onFocus);
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onFocus);
    })

    useMeta();



</script>