<template>
    <div id="Home">
        <component :is="component"  :day="actualDay" :lastday="lastDay" v-if="component" />
    </div>
</template>

<script>
import userService from '../../../services/userServiceChecklist'
export default {
    name: 'Home',
    data () {
        return {
            user: 'marco_bz',
            isStarted: false,
            actualDay: this.getDate(),
            lastDay: null,
            component: null
        }
    },

    mounted () {
        console.log('test1')
    },

    computed: {
        loader () {
            if (!this.isStarted) {
                this.isStarted = false
                return () => import(`./StartNewDay`)
            }
            else {
                return () => import(`./DailyChecklist`)
            }
        }
    },

    mounted () {
        this.getLastDay()
            .then(() => {
                this.component = () => this.loader()
            })
            .catch(() => {
                // console.log('error') 
            })
    },

    methods: {
        async getLastDay () {
            let response = await (userService.fetchLastDay(this.user))
            let responseObj = JSON.parse(response.request.response)
            if (responseObj.message === 'The user exists') {
                this.lastDay = responseObj.content.lastDay
                if (this.lastDay === this.actualDay) this.isStarted = true
            }
        },

        getDate () {
            let today = new Date().toISOString()
            let todayFormatted = today.split('T')[0].split('-')[2] + '.' + today.split('T')[0].split('-')[1] + '.' + today.split('T')[0].split('-')[0]
            return todayFormatted
        }
    }
}
</script>

<style>

</style>

