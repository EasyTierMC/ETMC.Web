<script setup lang="ts">
    import { ref } from "vue";

    const nodes = ref([
        {
            id: 1,
            status: "down",
            name: "Beta Node 7",
            location: "US",
            sponsor: "Blue",
            uptime: "99.8%",
        },
        {
            id: 2,
            status: "up",
            name: "Alpha Node 3",
            location: "UK",
            sponsor: "Jason",
            uptime: "98.5%",
        },
        {
            id: 3,
            status: "up",
            name: "Gamma Node 2",
            location: "JP",
            sponsor: "Whatever Foundation",
            uptime: "97.2%",
        },
    ]);
</script>

<template>
    <section class="pt-4 px-4">
        <div>
            <h1 class="text-3xl font-bold">Public Node Directory</h1>
            <p class="opacity-50 mt-2">
                Explore and contribute to our community-maintained list of public nodes. Your
                <br />
                participation ensures transparency and a robust network.
            </p>
        </div>
        <div class="grid grid-cols-3 grid-rows-1 mt-4 w-full gap-4">
            <div class="card shadow-[0_0_2px_0_var(--color-neutral-content)] p-4 bg-base-100">
                <div class="stat-title">Total Nodes</div>
                <div class="stat-value text-neutral-content">138</div>
                <div class="stat-desc text-success">+1.2% this week</div>
            </div>
            <div class="card shadow-[0_0_2px_0_var(--color-neutral-content)] p-4 bg-base-100">
                <div class="stat-title">Active Nodes</div>
                <div class="stat-value text-neutral-content">72</div>
                <div class="stat-desc text-success">+0.5% this week</div>
            </div>
            <div class="card shadow-[0_0_2px_0_var(--color-neutral-content)] p-4 bg-base-100">
                <div class="stat-title">Total Sponsors</div>
                <div class="stat-value text-neutral-content">24</div>
                <div class="stat-desc text-success">+3.1% this week</div>
            </div>
        </div>
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-4">
            <table class="table">
                <!-- head -->
                <thead class="bg-base-300">
                    <tr>
                        <th>STATUS</th>
                        <th>NODE NAME</th>
                        <th>LOCATION</th>
                        <th>SPONSOR</th>
                        <th>UPTIME</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="node in nodes" :key="node.id">
                        <td>
                            <div class="inline-grid *:[grid-area:1/1] -translate-y-0.25" v-if="node.status === 'up'">
                                <div class="status status-success animate-ping"></div>
                                <div class="status status-success"></div>
                            </div>
                            <div class="status status-error -translate-y-0.25" v-else></div>
                            <span class="ml-2">{{ node.status == "up" ? "Online" : "Offline" }}</span>
                        </td>
                        <td>{{ node.name }}</td>
                        <td>{{ node.location }}</td>
                        <td>{{ node.sponsor }}</td>
                        <td>{{ node.uptime }}</td>
                        <td>
                            <button class="btn aspect-square">
                                <i class="icon-[octicon--info-24] size-5 -mx-2.5" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
