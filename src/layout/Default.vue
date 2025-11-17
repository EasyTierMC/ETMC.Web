<template>
    <div class="layout">
        <nav class="navbar bg-base-100 shadow-sm justify-between">
            <a class="btn btn-ghost text-xl">EasyTierMC Uptime</a>
            <section class="flex gap-2">
                <button class="btn btn-link">Home</button>
                <button class="btn btn-link">About</button>
                <button class="btn btn-link">Docs</button>
            </section>
            <button class="btn btn-primary mr-4">Submit a Node</button>
        </nav>
        <div class="content p-4">
            <slot />
        </div>
        <div class="divider"></div>
        <footer class="p-4 -mt-2">
            <p>&copy; {{ new Date().getFullYear() }} EasyTierMC. All Right Reserved.</p>
        </footer>
    </div>
</template>
